'use client'

import React, { ReactNode } from 'react'
import {LiveblocksProvider, ClientSideSuspense} from "@liveblocks/react/suspense";
import Loader from '@/components/Loader';
import { getClerkUsers } from '@/lib/actions/user.actions';

const Provider = ({ children } : { children: ReactNode }) => {
    return (
        <LiveblocksProvider 
            authEndpoint="/api/liveblocks-auth"
            resolveUsers={async ({ userIds }) => {
                const users = await getClerkUsers({ userIds });

                return users;
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