import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import React from 'react'
import { SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import CollaborativeRoom from '@/components/CollaborativeRoom'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getDocument } from '@/lib/actions/room.actions'

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

  // TODO: Access the user permission level to the document

  return (
    <div className='w-full flex flex-col items-center'>
      <CollaborativeRoom 
        roomId={id}
        roomMetadata={room.metadata} users={[]} currentUserType={'editor'}/>
    </div>
  )
}

export default Document

// In this page we trying to access a document via a ID, coming to us through params