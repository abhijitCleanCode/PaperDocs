// app > Provider > resolveUsers

'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";

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