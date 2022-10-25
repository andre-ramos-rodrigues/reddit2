import { ChevronUpIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React from 'react'
import Avatar from './Avatar'

type Props = {
  index: number
  topic: string
}

const SubredditRow = ({ index, topic }: Props) => {
  return (
    <div className='flex items-center space-x-2 border-t bg-white px-4 py-2 last:rounded-b'>
      <p>{index + 1}</p>
      <ChevronUpIcon className='h-4 w-4 flex-shrink-0 text-green-400' />
      <Avatar seed={`/subreddit/${topic}`} />
      <p className='flex-1 truncate'>t/{topic}</p>
      <Link href={`/subreddit/${topic}`}>
      <div className='cursor-pointer rounded-full bg-blue-400 hover:bg-blue-500 px-2 py-1 text-white text-xs'>
        View
      </div>
      </Link>
    </div>
  )
}

export default SubredditRow