import React, {useEffect} from 'react'
import { useMutation } from '@apollo/client'
import {ADD_LIKE, UNLIKE, ALL_POSTS} from '../queries'
import {setPublishedTime} from '../helpers/setPublishedTime'
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Icon } from 'semantic-ui-react';
import {
  Link
} from "react-router-dom"

const Post = ({p, setSelectedPost, setShowLikesModal, setShowCommentsModal, removePost, setMessageHeader, emptyMessageHeader, commentsRef, user}) => {

  const [like, likeResult] = useMutation(ADD_LIKE, {
    refetchQueries: [ { query: ALL_POSTS } ],
    onError: (error) => {
      setMessageHeader(error.graphQLErrors[0].message)
      emptyMessageHeader()
    }
  })

  const [unlike, unlikeResult] = useMutation(UNLIKE, {
    refetchQueries: [ { query: ALL_POSTS } ],
    onError: (error) => {
      setMessageHeader(error.graphQLErrors[0].message)
      emptyMessageHeader()
    }
  })

  const likeButton = React.createRef()
  const unlikeButton = React.createRef()

  useEffect(() => {
    if ( likeResult.data ) {
      likeButton.current.disabled = false
    }
  }, [likeResult.data]) // eslint-disable-line

  useEffect(() => {
    if ( unlikeResult.data ) {
      unlikeButton.current.disabled = false
    }
  }, [unlikeResult.data]) // eslint-disable-line

  const likePost = (target, post) => {
    like({variables: {post: post.id}})
  }

  const unlikePost = (target, post) => {
    unlike({variables: {post: post.id}})
  }

  const renderLikeButton = (post) => {
    console.log("Post likes, ", post.likes)
    if (post.likes.filter(l => l.user.username === user.username).length === 0) {
      return (
        <Button ref={likeButton} variant="primary" onClick={({target}) => {
          likePost(target, post)
          target.disabled = true
        }}>Like</Button>
      )
    } else {
      return (
        <Button ref={unlikeButton} variant="primary" onClick={({target}) => {
          unlikePost(target, post)
          target.disabled = true
        }}>Unlike</Button>
      )
    }
  }

  const renderActions = (post) => {
    if (post.user.username !== user.username) {
      return (
        <div className="post-action-button">
          {renderLikeButton(post)}
          <Button className="margin-left-10" variant="primary" onClick={() => {
            setSelectedPost(post)
            commentsRef.current.getComments({variables: {post: post.id}})
            setShowCommentsModal(true)
          }}>Comment</Button>
        </div>
      )
    } else {
      return (
        <Button onClick={() =>
          removePost(post)
        } className="ui negative button">Delete</Button>
      )
    }
  }

  const renderLink = (str, isStr) => {
    let word = str
    if (str.substr(0, 8) !== "https://") {
      word = 'https://' + str
    }

    if (isStr) {
      return `<a href=${word} target="_blank">${str}</a>`
    } else {
      return <a href={word} rel="noopener noreferrer" target="_blank">{str} </a>
    }
  }

  const renderContent = (content) => {
    var urlRE = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+");
    if (content.length > 200) {
      const words = content.substr(0, 200).split(" ")
      words.pop()
      console.log(words.length)
      return <div>{words.map((word, i) => word.match(urlRE) ? renderLink(word, false) : i === (words.length - 1) ? word + "" : word + " ")}... <button className="seeMoreButton" onClick={({target}) => {
        target.parentNode.innerHTML = `<div> ${content.split(" ").map((word, i) => word.match(urlRE) ? renderLink(word, true) : word + " ").join(" ") }</div>`
      }}>See more</button></div>
    } else {
      return <div>{content.split(" ").map((word, i) => word.match(urlRE) ? renderLink(word, false) + " " : word + " ")}</div>
    }
  }

  return (
    <div className="card-content">
      <Card>
        <Card.Header className="card-header">
          <Row>
            <Col>{setPublishedTime(p)}</Col>
            <Col xs={5}></Col>
            <Col></Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Card.Title>{p.user.profilePicture ? <img className="profile-picture" src={p.user.profilePicture.imageUrl}/> : <Icon name="user" size='small'/>} <Link className="userLink" to={`/users/${p.user.id}`}>{p.user.username}</Link></Card.Title>
          <Card.Text className="postContent">
            {renderContent(p.content)}
          </Card.Text>
        </Card.Body>
        <div className="cardImageContainer">{p.image ? <Card.Img className="card-image" variant="top" src={p.image.imageUrl} /> : null}</div>
        <Card.Body className="cardActions">
          <Button variant="link" onClick={() => {
            setSelectedPost(p)
            commentsRef.current.getComments({variables: {post: p.id}})
            setShowCommentsModal(true)
          }}>{p.comments.length} comments</Button>
          <Button variant="link" onClick={() => {
            setSelectedPost(p)
            setShowLikesModal(true)
          }}>{p.likes.length} likes</Button>
          {renderActions(p)}
        </Card.Body>
      </Card>
    </div>
  )
}

export default Post
