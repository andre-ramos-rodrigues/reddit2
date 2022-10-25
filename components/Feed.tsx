import { useQuery } from '@apollo/client'
import React from 'react'
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from '../graphql/queries'
import Post from './Post'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

type Props = {
  topic?: string
}

const Feed = ({ topic }: Props) => {
  const {data, error, loading} = !topic? useQuery(GET_ALL_POSTS) : useQuery(GET_ALL_POSTS_BY_TOPIC, {
    variables: {
      topic: topic
    }
  })
  const posts: Post[] = !topic ? data?.getPostList : data?.getPostListByTopic
  console.log(error?.message)
  return (
    <div className="mt-5 space-y-5">
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {loading && <p>loading...</p>}
    </div>
  )
}

export default Feed