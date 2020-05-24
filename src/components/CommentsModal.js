import React, {useState, useEffect, useImperativeHandle} from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'
import {ADD_COMMENT, ALL_POSTS, ALL_COMMENTS} from '../queries'
import { Modal } from 'react-bootstrap';
import {Link} from 'react-router-dom'
import {Button, Comment, Form} from 'semantic-ui-react'
import {setPublishedTime} from '../helpers/setPublishedTime'

const CommentsModal = React.forwardRef(({showCommentsModal, setShowCommentsModal, post, setMessageHeader, emptyMessageHeader}, ref) => {
  const [content, setContent] = useState("")
  const [comments, setComments] = useState([])
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
  const [submitButtonContent, setSubmitButtonContent] = useState("Add Comment")

  const commentGroup = React.createRef();

  const [getComments, {data, refetch, loading, networkStatus}] = useLazyQuery(ALL_COMMENTS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      scrollToBottom()
    }
  })

  const [addComment, addCommentResult] = useMutation(ADD_COMMENT, {
    refetchQueries: [ { query: ALL_POSTS } ],
    onError: (error) => {
      setMessageHeader(error.graphQLErrors[0].message)
      emptyMessageHeader()
      setSubmitButtonDisabled(false)
      setSubmitButtonContent("Add Comment")
    }
  })

  useEffect(() => {
    if (data) {
      console.log("COMMENTS DATA", data)
      setComments(data.allComments)
      scrollToBottom()
    }
  }, [data])

  useEffect(() => {
    if (addCommentResult.data) {
      console.log("COMMENT DATA", addCommentResult.data)
      refetch()
      setSubmitButtonDisabled(false)
      setSubmitButtonContent("Add Comment")
    }
  }, [addCommentResult.data])

  const scrollToBottom = () => {
    commentGroup.current.scrollTop = commentGroup.current.scrollHeight
  }

  useImperativeHandle(ref, () => {
    return {
      setComments,
      getComments,
      scrollToBottom
    }
  })

  const contentOnChange = (e) => {
    setContent(e.target.value)
    console.log(content)
    console.log()
  }

  const submit = (e) => {
    e.preventDefault()
    setContent("")
    e.target[0].value = ""
    setSubmitButtonDisabled(true)
    setSubmitButtonContent("Commenting...")
    addComment({variables: {post: post.id, content: content}})
  }

  const commentsFeed = () => {
    return (
      <div>
        {comments.map(comment =>
          <Comment>
            <Comment.Avatar src={comment.user.profilePicture.imageUrl} />
            <Comment.Content>
              <Comment.Author as='a' href={`/users/${comment.user.id}`}>{comment.user.username}</Comment.Author>
              <Comment.Metadata>
                <div>{setPublishedTime(comment)}</div>
              </Comment.Metadata>
              <Comment.Text>{comment.content}</Comment.Text>
            </Comment.Content>
          </Comment>
        )}
      </div>
    )
  }

  const renderComments = () => {
    if (loading || networkStatus === 4) {
      return (
        <h3>Loading comments...</h3>
      )
    } else {
      return (
        commentsFeed()
      )
    }
  }

  if (showCommentsModal && post) {
    return (
      <Modal
          show={showCommentsModal}
          onHide={() => {
            setShowCommentsModal(false)
          }}
          aria-labelledby="example-modal-sizes-title-lg">

        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Comments
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div ref={commentGroup} className="comment-group" id="comment-group">
          <Comment.Group>
            {renderComments()}
          </Comment.Group>
        </div>
            <Form onSubmit={submit}>
              <Form.TextArea onChange={contentOnChange} placeholder="Write a comment..."/>
              <Button content={submitButtonContent} labelPosition='left' icon='edit' primary disabled={submitButtonDisabled} />
            </Form>
        </Modal.Body>

      </Modal>
    )
  } else {
    return null
  }
})

export default CommentsModal
