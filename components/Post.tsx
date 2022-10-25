import { ArrowUpIcon, GiftIcon, GiftTopIcon } from '@heroicons/react/24/outline'
import { ArrowDownIcon, BookmarkIcon, ChatBubbleLeftIcon, GifIcon, ShareIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import { Jelly } from '@uiball/loaders'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { GET_VOTES_BY_POST_ID } from '../graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_VOTE } from '../graphql/mutations'

type Props = {
  post: Post
}

const Post = ({post}: Props) => {
  const [vote, setVote] = useState<any>()
  const {data: session} = useSession()

  // fetching votes by post_id
  const {data, loading} = useQuery(GET_VOTES_BY_POST_ID, {
    variables: {
      post_id: post?.id
    }
  })

  // adding votes ignites refetchQueries
  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_VOTES_BY_POST_ID, 'getVotesByPostId']
  })

  const upVote = async(isUp: boolean) => {
    console.log('voting... ', isUp)
    if(!session){
      toast("You need to login in order to vote!")
      return
    }
    //if(vote || isUp) return
    if (vote === false && !isUp) return


    await addVote({
      variables: {
        post_id: post.id,
        username: session?.user?.name,
        upvote: isUp
      }
    })
    
  }

  // check if current user already voted
  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostId

    const vote = votes?.find((vote) => vote.username == session?.user?.name)

    setVote(vote)

  }, [data])

  // if the vote is true, add one vote, if false, remove one vote
  const displayVote = (data: any) => {
    const votes: Vote[] = data?.getVotesByPostId
    const displayNumber = votes?.reduce((total,vote) => (
      vote.upvote ? (total += 1) : (total -= 1)
    ), 0)

    if(votes?.length === 0) return 0;
    if(displayNumber === 0) {
      return votes[0]?.upvote ? 1 : -1
    }
    return displayNumber
  }

  if(!post) return (
    <div className='flex w-full items-center justify-center text-xl mt-5'>
      <Jelly size={50} color='#FF4501'/>
    </div>
  )
  return (
    <Link href={`/post/${post.id}`}>
    <div className="flex cursor-pointer rounded-md border border-gray-300 bg-white shadow-sm hover:border-gray-600">

      <div className="flex flex-col items-center justify-start space-y-1 bg-gray-50 rounded-l-md p-4 text-gray-400" >
        <ArrowUpIcon className={`voteButtons hover:text-blue-400 ${vote && 'text-blue-400'}`} onClick={() => upVote(true)}/>
        <p>{displayVote(data)}</p>
        <ArrowDownIcon className={`voteButtons hover:text-red-400 ${vote === false && 'text-red-400'}`} onClick={() => upVote(false)}/>
      </div>

      <div className="p-3 pb-1">
      <div className="flex items-center space-x-2">
        <Avatar seed={post.subreddit[0]?.topic} />
        <p className="text-xs text-gray-400">
          <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
          <span className="font-bold text-black hover:text-blue-400 hover:underline">r/{post.subreddit[0]?.topic}</span>
          </Link>
          .  Posted by u/{post.username} <TimeAgo date={post.created_at} />
        </p>
      </div>
      
      <div className="py-4">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <p className="mt-2 text-sm font-light">{post.body}</p>
      </div>
      <img src={post.image} alt="" className="w-full"/>
      
      <div className="flex space-x-4 text-gray-400">
        <div className='postButtons'>
          <ChatBubbleLeftIcon className="h-6 w-6"/>
          <p>{post.comments.length} Comments</p>
        </div>
        <div className='postButtons'>
          <GiftTopIcon className="h-6 w-6"/>
          <p className="hidden md:inline">Award</p>
        </div>
        <div className='postButtons'>
          <ShareIcon className="h-6 w-6"/>
          <p className="hidden md:inline">Share</p>
        </div>
        <div className='postButtons'>
          <BookmarkIcon className="h-6 w-6"/>
          <p className="hidden md:inline">Save</p>
        </div>
      </div>
      </div>

    </div>
    </Link>
  )
}

export default Post