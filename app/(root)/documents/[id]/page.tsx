import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import React from 'react'
import { SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import CollaborativeRoom from '@/components/CollaborativeRoom'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDocument } from '@/lib/actions/room.actions'
import { getClerkUsers } from '@/lib/actions/user.actions'

const Document = async ({ params: {id} }: SearchParamProps) => {
  // get access to signed in user id
  const clerkUser = await currentUser();
  if(!clerkUser)
      redirect('/sign-in');

  // check user permission to this room, if user exist
  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  })

  if (!room)
    redirect('/');

  // Access the user permission level to the document
  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });
  // Extract the users data, this is for all the users
  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes('room:write') ? 'editor' : "viewer"
  }))
  // Access the permission level of current user to a document
  const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer'

  return (
    <div className='w-full flex flex-col items-center'>
      <CollaborativeRoom 
        roomId={id}
        roomMetadata={room.metadata} 
        users={usersData} 
        currentUserType={currentUserType}/>
    </div>
  )
}

export default Document

// In this page we trying to access a document via a ID, coming to us through params