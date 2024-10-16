'use client'

import Image from 'next/image';
import React, { useState } from 'react'
import UserTypeSelector from './UserTypeSelector';
import { Button } from './ui/button';

const Collaborator = ({ roomId, creatorId, email, collaborator, user }: CollaboratorProps) => {
    // to modify the type of user already exist
    const [first, setfirst] = useState(collaborator.userType || 'viewer');
    // loading state
    const [loading, setLoading] = useState(false)

    // this is where the magic happen in function
    const shareDocumentHandler = async (type: string) => {}
    const removeCollaboratorHandler = async (email: string) => {}

    return (
        <li className='flex items-center justify-between gap-2 py-3'>
            <div className='flex gap-2'>
                <Image 
                    src={collaborator.avatar}
                    alt={collaborator.name}
                    width={36}
                    height={36}
                    className='size-9 rounded-full'
                />

                <div>
                    <p className='line-clamp-1 text-sm font-semibold leading-4 text-white'>
                        {collaborator.name}
                    </p>
                    <span className='text-10-regular pl-2 text-blue-100'>
                        {loading && 'updating...'}
                    </span>
                    <p className='text-sm font-light text-blue-100'>
                        {collaborator.email}
                    </p>
                </div>
            </div>

            {/* allow owner this permission */}
            {
                creatorId === collaborator.id ? (
                    <p className='text-sm text-blue-100'>Owner</p>
                ) : (
                    <div className='flex items-center'>
                        <UserTypeSelector
                            userType={userType as UserType}
                            setUserType={setUserType || 'viewer'}
                            onClickHandler={shareDocumentHandler}
                        />
                        {/* using email get to know which user is to remove */}
                        <Button type='button' onClick={() => removeCollaboratorHandler(collaborator.email)}>Remove</Button>
                    </div>
                )
            }
        </li>
    )
}

export default Collaborator