import React from 'react'
import { useThreads } from '@liveblocks/react/suspense'
import { Composer, Thread } from '@liveblocks/react-ui';
import { useIsThreadActive } from '@liveblocks/react-lexical';
import { cn } from '@/lib/utils';

const ThreadWrapper = ({ thread }: ThreadWrapperProps) => {
  // figure out whether this thread is active or not
  const isActive = useIsThreadActive(thread.id);

  return (
    // comming from liveblocks ui, accepts thread info
    <Thread
      thread={thread}
      data-state = {isActive ? 'active' : null}
      className={cn('comment-thread border',
        isActive && '!border-blue-500 shadow-md',
        thread.resolved && 'opacity-40' // if thread is resolve lower the opacity
      )}
    />
  )
}

const Comments = () => {
  // get the all the existing comment threads
  const { threads } = useThreads();

  return (
    <div className='comments-container'>
      <Composer className='comment-composer' />

      {
        threads.map((thread) => (
          <ThreadWrapper key={thread.id} thread={thread} />
        ))
      }
    </div>
  )
}

export default Comments

// composer: allows us to wrap a comment