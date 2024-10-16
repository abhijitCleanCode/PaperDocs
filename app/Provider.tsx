'use client'

import React, { ReactNode } from 'react'
import {LiveblocksProvider, ClientSideSuspense} from "@liveblocks/react/suspense";
import Loader from '@/components/Loader';
import { getClerkUsers, getDocumentUsers } from '@/lib/actions/user.actions';
import { useUser } from '@clerk/nextjs';

const Provider = ({ children } : { children: ReactNode }) => {
    // return user object if user is signed in
    const { user: clerkUser } = useUser();

    return (
        <LiveblocksProvider 
            authEndpoint="/api/liveblocks-auth"
            resolveUsers={async ({ userIds }) => {
                const users = await getClerkUsers({ userIds });

                return users;
            }}
            // to tag someone in docs u need to know that user is in which rooms, enabling tag feature
            resolveMentionSuggestions={async ({ text, roomId }) => {
                const roomUsers = await getDocumentUsers({
                    roomId,
                    currentUser: clerkUser?.emailAddresses[0].emailAddress!,
                    text
                });
                // doing this much allow liveblock to know which user we are trying to mention
                return roomUsers;
            }}
        >
            <ClientSideSuspense fallback={<Loader />}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    )
}

export default Provider

// separate provider is created because our application has many rooms
// resolveUsers provide a way in which live Blocks resolve the user or active collaborators to a room