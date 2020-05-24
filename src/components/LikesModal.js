import React from 'react'
import {Modal} from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch, Route, Link, useParams, Redirect
} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import {addPost} from '../reducers/postsReducer'
import {Feed} from 'semantic-ui-react'

const LikesModal = ({showLikesModal, setShowLikesModal, post}) => {
  const dispatch = useDispatch()

  if (showLikesModal && post) {
    return (
      <Modal
          show={showLikesModal}
          onHide={() => setShowLikesModal(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >

        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Likes
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Feed className="likes-group">
            {post.likes.map(l =>
                <Feed.Event>
                  <Feed.Label image={l.user.profilePicture.imageUrl} />
                  <Feed.Content>
                    <Feed.Summary>
                      {l.user.username}
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
              )}
          </Feed>
        </Modal.Body>

      </Modal>
    )
  } else {
    return null
  }
}

export default LikesModal
