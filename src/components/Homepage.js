import React, {useState, useEffect} from 'react'
import { useMutation } from '@apollo/client'
import {ALL_POSTS, DELETE_POST} from '../queries'
import { useSelector } from 'react-redux'
import LikesModal from './LikesModal'
import CommentsModal from './CommentsModal'
import Post from './Post'

const Homepage = ({logout, setMessageContent, setMessageHeader, emptyMessageHeader}) => {
  const posts = useSelector(state => state.posts)
  const user = useSelector(state => state.user)
  const [selectedPost, setSelectedPost] = useState(null)

  console.log("USER IN STATE", user)
  const [showLikesModal, setShowLikesModal] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)

  const commentsRef = React.createRef()

  const [deletePost, deletePostResult] = useMutation(DELETE_POST, {
    refetchQueries: [ { query: ALL_POSTS } ],
    onError: (error) => {
      setMessageHeader(error.graphQLErrors[0].message)
      emptyMessageHeader()
    }
  })

  useEffect(() => {
    if (deletePostResult.data) {
      setMessageHeader("Your post has been deleted")
      emptyMessageHeader()
    }
  }, [deletePostResult.data])

  const removePost = (post) => {
    const confirm = window.confirm("Are you sure you want to delete this post?")
    if(confirm) {
      deletePost({variables: {post: post.id}})
      setMessageHeader("Deleting post...")
    }
  }

  console.log("Post2", selectedPost)
  console.log("SHow likes modal", showLikesModal)

  return (
    <div>
      <LikesModal showLikesModal={showLikesModal} setShowLikesModal={setShowLikesModal} post={selectedPost}/>
      <CommentsModal setMessageHeader={setMessageHeader} emptyMessageHeader={emptyMessageHeader} showCommentsModal={showCommentsModal} setShowCommentsModal={setShowCommentsModal} post={selectedPost} ref={commentsRef}/>
      <div className="cards">
        {posts.map(p =>
          <Post p={p} setSelectedPost={setSelectedPost} setShowLikesModal={setShowLikesModal} setShowCommentsModal={setShowCommentsModal} removePost={removePost} setMessageHeader={setMessageHeader} emptyMessageHeader={emptyMessageHeader} commentsRef={commentsRef} user={user}/>
        )}
      </div>
    </div>
  )
}

export default Homepage
