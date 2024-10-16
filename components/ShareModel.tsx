'use client';

import { useSelf } from '@liveblocks/react/suspense';
import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { Input } from './ui/input';
import Image from 'next/image';
import { Label } from './ui/label';
import UserTypeSelector from './UserTypeSelector';
import Collaborator from './Collaborator';


const ShareModel = ({ roomId, collaborators, creatorId, currentUserType }: ShareDocumentDialogProps) => {
  // get access to which user is trying to change permission, get the user once it is connected to the room
  const user = useSelf();
  // track whether the model is open or close
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // declare state for user type and then get access to user email we are trying to add
  const [email, setEmail] = useState('');
  // state to decide which type we want to give to this user, viewer or editor
  const [userType, setUserType] = useState<UserType>('viewer')

  // handler function to share the document
  const shareDocumentHandler = async () => { }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className='gradient-blue flex h-9 gap-1 px-4'
          disabled={currentUserType !== 'editor'}
        >
          <Image 
            src="/assets/icons/share.svg"
            alt='share'
            width={20}
            height={20}
            className='min-w-4 md:size-5'
          />
          <p className='mr-1 hidden sm:block'>
            Share
          </p>
        </Button>
      </DialogTrigger>

      <DialogContent className='shad-dialog '>
        <DialogHeader>
          <DialogTitle>Manage Who can view this project</DialogTitle>
          <DialogDescription>
            Select which user can view and edit this document
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="email" className="mt-6 text-blue-100">Email Address</Label>
        <div className='flex items-center gap-3'>
          <div className='flex flex-1 rounded-md bg-dark-400'>
            <Input 
              id='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='share-input'
            />
            {/* passing these two props allow us to control what we are doing inside of this component */}
            <UserTypeSelector 
              userType={userType}
              setUserType={setUserType}
            />
          </div>

          <Button type='submit' className='gradient-blue flex gap-1 h-full px-5' disabled={loading}>{loading ? "Sending..." : "Invite"}</Button>
        </div>

        {/* show all of the collaborators that we have invited so far */}
        <div className='my-2 space-y-2'>
          <ul className='flex flex-col'>
            {
              collaborators.map((collaborator) => (
                <Collaborator 
                  key={collaborator.id}
                  roomId={roomId}
                  creatorId={creatorId}
                  email={collaborator.email}
                  collaborator={collaborator}
                  user={user.info}
                />
              ))
            }
          </ul>
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default ShareModel