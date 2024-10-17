'use server';

// a room is created whenever a new document is created
import { nanoid } from "nanoid";
import { liveblocks } from "../liveblock";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import { redirect } from "next/navigation";

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
    const roomId = nanoid();

    try {
        const metadata = {
            creatorId: userId,
            email,
            title: 'Untitled Document',
        }

        // only the user that has created the document has access
        const usersAccesses: RoomAccesses = {
            [email]: ['room:write']
        }

        // Need to implement share functionality so that other people can access it
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: [] // empty array because we don't want to give write access as default to everybody
        })

        revalidatePath('/'); // new document will appear on home screen

        return parseStringify(room);
    } catch (error) {
        console.log("Error creating room", error);
    }
}
// Our server component is ready which will be call from the client component (home page) when a user clicks the create document button because each document is a new room

export const getDocument = async ({ roomId, userId }: { roomId: string; userId: string }) => {
    try {
        // 1. get access to room
        const room = await liveblocks.getRoom(roomId);

        // 2. check if user has access to that room: check the userId of user who is currently trying to look into this room is in this array
        const hasAccess = Object.keys(room.usersAccesses).includes(userId);
        if (!hasAccess) {
            throw new Error("You do not have access to this document")
        }

        return parseStringify(room);
    } catch (error) {
        console.log('Error happen while getting a room', error);
    }
}
// we will call this function in a page where we trying to fetch information about document

export const updateDocument = async (roomId: string, title: string) => {
    try {
        const updateRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title,
            }
        })

        // call, so that things actually change in the document
        revalidatePath(`/document/${roomId}`);

        return parseStringify(updateRoom);
    } catch (error) {
        console.log('room.actions.ts :: error while updating the doc title: ', error);
    }
}

export const getDocuments = async (email: string) => {
    try {
        // 1. get all the rooms from liveBlocks storage with this userId
        const rooms = await liveblocks.getRooms({ userId: email });

        return parseStringify(rooms);
    } catch (error) {
        console.log('Error happen while getting all the rooms', error);
    }
}

export const updateDocumentAccess = async ({roomId, email, userType, updatedBy}: ShareDocumentParams) => {
    try {
        // this contains a list of all the user access
        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType,
        }

        const room = await liveblocks.updateRoom(roomId, { usersAccesses });
        
        // if room is updated successfully, then send notification to user
        if (room) {
            // TODO: send notification to user
        }

        // change the share model, by revalidating the path
        revalidatePath(`/documents/${roomId}`);

        return parseStringify(room);
    } catch (error) {
        console.log('server action :: room :: updateDocumentAccess: error happen while updating room: ', error);
    }
}

export const removeCollaborator = async ({roomId, email}: {roomId: string, email: string}) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        // check if person is the owner
        if (room.metadata.email === email) {
            throw new Error("You can not remove yourself from the document");
        }

        const updateRoom = liveblocks.updateRoom(roomId, {
            // pass the user accesses by removing the access for a specific email
            usersAccesses: {
                [email]: null,
            }
        })

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(updateRoom);
    } catch (error) {
        console.log('error happened while removing a collaborator: ', error);
    }
}

export const deleteDocument = async (roomId: string) => {
    try {
        await liveblocks.deleteRoom(roomId);
        revalidatePath('/');
        // u can delete a document from anywhere and redirect to home page
        redirect('/');
    } catch (error) {
        console.log('Error happen while deleting the room, document', error);
    }
}