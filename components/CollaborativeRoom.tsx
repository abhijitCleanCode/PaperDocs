'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import { SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs'
import { Editor } from '@/components/editor/Editor'
import Header from './Header'
import ActiveCollaborators from './ActiveCollaborators'
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { updateDocument } from '@/lib/actions/room.actions'
import Loader from './Loader'

const CollaborativeRoom = ({ roomId, roomMetadata }: CollaborativeRoomProps) => {
    // special variable depending whether user has access to editor or not
    const currentUserType = "editor"

    const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    // remove input field when user click outside & save changes
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setEditing(false);
                // save the updated title if there is any changes and user clicks outside
                updateDocument(roomId, documentTitle);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [roomId, documentTitle])

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus(); // focus on input so that user know that they are typing
        }
    }, [editing])

    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            setLoading(true);

            try {
                // title is updated, thus update document
                if (documentTitle !== roomMetadata.title) {
                    const updatedDocument = await updateDocument(roomId, documentTitle);

                    // stop editing if u got access to updated document
                    if (updatedDocument) {
                        setEditing(false);
                    }
                }
            } catch (error) {
                console.log('CollaborativeRoom :: updateTitleHandler :: error: ', error);
            }

            setLoading(false);
        }
    }
 
    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <div className='collaborative-room'>
                    <Header>
                        <div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
                            {
                                editing && !loading ? (
                                    <Input 
                                        type='text'
                                        value={documentTitle}
                                        ref={inputRef}
                                        placeholder='Enter title'
                                        onChange={(e) => setDocumentTitle(e.target.value)}
                                        onKeyDown={updateTitleHandler}
                                        disabled={!editing}
                                        className='document-title-input'
                                    />
                                ) : (
                                    <p className='document-title'>{documentTitle}</p>
                                )
                            }

                            {
                                currentUserType === "editor" && !editing && (
                                    <Image
                                        src="/assets/icons/edit.svg"
                                        alt='edit'
                                        width={24}
                                        height={24}
                                        onClick={() => setEditing(true)}
                                        className='pointer'
                                    />
                                )
                            }

                            {
                                currentUserType !== "editor" && !editing && (
                                    <p className='view-only-tag'>View Only</p>
                                )
                            }

                            {loading && <p className='text-sm text-gray-400'>saving...</p> }
                        </div>

                        <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
                            <ActiveCollaborators />

                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Header>
                    
                    <Editor roomId={'test'} currentUserType={'editor'} />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    )
}

export default CollaborativeRoom