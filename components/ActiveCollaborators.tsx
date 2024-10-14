import { useOthers } from '@liveblocks/react/suspense'
import Image from 'next/image';
import React from 'react'

const ActiveCollaborators = () => {
    // 1. get the access to other people viewing the document
    const others = useOthers();

    // 2. extract the collaborators, contributing to a room
    const collaborators = others.map((other) => other.info);

  return (
    <ul className='collaborators-list'>
        {
            collaborators.map(({id, avatar, name, color}) => (
                <li key={id}>
                    <Image 
                        src={avatar}
                        alt={name}
                        width={100}
                        height={100}
                        className='inline-block size-8 rounded-full ring-2 ring-dark-100'
                        style={{border: `3px solid ${color}`}}
                    />
                </li>
            ))
        }
    </ul>
  )
}

export default ActiveCollaborators

// Give us the bird eye view of the user that has the access to edit a particular document