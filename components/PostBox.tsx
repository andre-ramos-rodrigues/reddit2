import { LinkIcon, PhotoIcon } from '@heroicons/react/24/solid'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar'
import {useForm} from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import {toast} from 'react-hot-toast'
import client from '../apollo/apollo-client'


type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}

type Props = {
  subreddit?: string
}

const PostBox = ({ subreddit }: Props) => {
  const {data: session} = useSession()

  // adding refetchQueries so addPost will ignite getPostList
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries:[
      GET_ALL_POSTS,
      'getPostList'
    ]
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: {errors}
  } = useForm<FormData>()
  const [imgBoxOpen, setImgBoxOpen] = useState<Boolean>(false)

  const onSubmit = handleSubmit(async (formData) => {
    const notification = toast.loading('creating new post')
    console.log(formData)

    try{

      // check if the subreddit got posts inside
      const {data: {getSubredditListByTopic}} = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit
        }
      })

      const subredditExists = getSubredditListByTopic.length > 0
      
      // if not, then this subreddit doesn't exist, so create it
      if(!subredditExists){
        console.log("hmmm this subreddit is new.... creating new subreddit...")

        const {data: {insertSubreddit: newSubreddit}} = await addSubreddit({
          variables: {
            topic: formData.subreddit
          }
        })

        console.log("creating post...")
        console.log(newSubreddit.id)

        // case not image, use empty string (protecting the function from errors)
        const image = formData.postImage || ""

        const {data: {insertPost: newPost}} = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        })

        console.log("new post added:  ", newPost)
        
      }else{
        // use existing subreddit
        console.log("subreddit already exists! ...creating new post")
      
        // case not image, use empty string (protecting the function from errors)
        const image = formData.postImage || ""
        
        const {data: {insertPost: newPost}} = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name
          }
        })
        console.log("new post added:  ", newPost)
      }

      setValue('postTitle', '')
      setValue('postBody', '')
      setValue('postImage', '')
      setValue('subreddit', '')

      toast.success("post created!", {
        id: notification
      })
    }catch(err){
      console.log(err)
      toast.error('something went wrong', {
        id: notification
      })
    }
  })

  return (
    <form onSubmit={onSubmit} className='sticky top-16 z-25 bg-white border border-rouded-md border-gray-300 p-2 flex flex-col items-center justify-center'>
      <div className='flex items-center space-x-3 w-full'>
        <Avatar />
        <input 
        {...register('postTitle', {required: true})}
        type="text" 
        placeholder={session? subreddit? `Create a post in r/${subreddit}` : 'create a post' : 'sign in to post'} 
        disabled={!session}
        className='bg-gray-50 p-2 pl-5 outline-none rounded-md w-full'
        />
        <div className='flex items-center gap-3'>
        <PhotoIcon 
        className={`h-6 w-6 text-gray-500 cursor-pointer ${imgBoxOpen && 'text-blue-300'}`}
        onClick={() => setImgBoxOpen(!imgBoxOpen)}
        />
        <LinkIcon className='h-6 w-6 text-gray-500 cursor-pointer'/>
      </div>
      </div>

      {/* conditional rendering */}
      {!!watch('postTitle') && ( // renders the code below if something is typed in postTitle
        <div className='flex flex-col py-2 w-full'>
          <div className='flex px-2'>
            <input 
            className='m-2 flex-1 bg-blue-50 p-2 outline-none w-full'
            type="text"
            {...register('postBody')}
            placeholder='Type here the body'
            />
          </div>

          {!subreddit && (
            <div className='flex px-2'>
            <input 
            className='m-2 flex-1 bg-blue-50 p-2 outline-none w-full'
            type="text"
            {...register('subreddit', {required: true})}
            placeholder='Type here the subreddit'
            />
            </div>
          )
          }
          

          {imgBoxOpen && (
            <div className='flex px-2'>
            <input 
            className='m-2 flex-1 bg-blue-50 p-2 outline-none w-full'
            type="text"
            {...register('postImage')}
            placeholder='Image URL'
            />
          </div>
          )}

          {/* erros */}
          {Object.keys(errors).length > 0 && (
            <div className='space-y-2 p-2 text-red-500 self-center'>
              {errors.postTitle?.type === 'required' && (
                <p>A post title is required</p>
              )}
              {errors.subreddit?.type === 'required' && (
                <p>A post title is required</p>
              )}
            </div>
          )}

          {!!watch('postTitle') && (
            <button className=' p-3 w-[220px] text-white bg-red-300 hover:bg-red-400 self-center mt-2 rounded-md font-semibold text-sm' disabled={!session}>Create post</button>
          )}
        </div>
      )}
    </form>
  )
}

export default PostBox