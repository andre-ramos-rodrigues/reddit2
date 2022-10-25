import { useQuery, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { Router, useRouter } from 'next/router'
import React from 'react'
import Post from '../../components/Post'
import { GET_POST_BY_ID } from '../../graphql/queries'
import { ADD_COMMENT } from '../../graphql/mutations'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Avatar from '../../components/Avatar'
import ReactTimeago from 'react-timeago'


const PostPage = () => {
  const router = useRouter()
  const {data: session} = useSession()
  const [addComment, { data: comment }] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_ID, 'getPostById']
  })

  // getting postId from params
  const {query: {postId}} = useRouter()
  const { loading, error, data} = useQuery(GET_POST_BY_ID, {
    variables: {
      post_id: postId
    }
  })

  // typying the post
  const post: Post = data?.getPostById
  console.log(error?.message)

  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {errors}
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async(data) => {
    console.log(data)

    const notification = toast.loading('Posting your comment')

    await addComment({
      variables: {
        post_id: router.query.postId,
        username: session?.user?.name,
        text: data.comment
      }
    })

    setValue('comment', '')

    toast.success('Comment Successfully Posted', {
      id: notification
    })
  }
  console.log(data)
  return (
    <div className='mx-auto my-7 max-w-5xl'>
      <Post post={post} />

      <div className="rounded-b-md border border-t-0 border-gray-300 bg-white -mt-1 p-5 pl-16">
        <p className="text-sm text-gray-400 mb-5">
          {session && (
            <div> Comment as <span className='text-green-300 font-semibold'>{session?.user?.name}</span>
            </div>)}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className='flex'>
          <textarea
          {...register('comment')}
           placeholder={session ? `Write here your comment` : `Login in to comment`} className='h-24 rounded-md border morder-gray-200 outline-none p-2 pl-4 disabled:bg-gray-50 flex-1' disabled={!session}/>
          <button type='submit' className='bg-red-300 text-white font-semibold p-3 hover:bg-red-400 rounded-r-md text-sm disabled:cursor-not-allowed' disabled={!session}>Comment</button>
        </form>
      </div>
      <div className='-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10'>
        <hr className='py-2'/>
        {post?.comments.map(comment => (
          <div key={comment.id} className='relative flex items-center space-x-2 space-y-5'>
            <hr className='absolute top-10 h-16 border left-7 z-0' />
            <div className='z-50'>
              <Avatar seed={comment.username} />
            </div>
            <div className='flex flex-col'>
              <p className='py-2 text-xs text-gray-400'>
                <span className='font-semibold text-gray-600'>
                  {comment.username}
                </span>
                {' '}
                <ReactTimeago date={comment.created_at}/>
              </p>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostPage