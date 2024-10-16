// app > Provider > resolveUsers

'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblock";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
        // destructuring the user data coming from clerkClient
        const { data } = await clerkClient.users.getUserList({ emailAddress: userIds })

        // once data is fetched, now form it into users
        const users = data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        }))

        // make sure user is sorted wrt userIds so that the order is consistent
        const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));

        return parseStringify(sortedUsers);
    } catch (error) {
        console.log('actions :: user.actions.ts :: getClerkUsers :: error while fetching user: ', error);
    }
}

export const getDocumentUsers = async ({roomId, currentUser, text}: {roomId: string, currentUser: string, text: string}) => {
    try {
        // 1. get access to room info
        const room = await liveblocks.getRoom(roomId);

        // 2. once we have the room, get access to users within that room
        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        // 3. if text exist, meaning we are trying to mention somebody
        if (text.length) {
            const lowerCaseText = text.toLowerCase();
            // filtering which specific user is mention
            const filteredUser = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText));

            return parseStringify(filteredUser);
        }

        // recommend any users, you know how it works, whats app.
        return parseStringify(users);
    } catch (error) {
        console.log('user.actions.ts :: getDocumentUsers :: error fetching document users: ', error);
    }
}