import React, {useState, useEffect} from 'react'
import { useMutation } from '@apollo/client'
import {ADD_POST, ALL_POSTS} from '../queries'
import { Modal, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import UploadPicture from './UploadPicture'
import { Button } from 'semantic-ui-react'

const AddPostModal = ({showModal, setShowModal, setMessageContent, setMessageHeader, emptyMessageHeader}) => {
  const [content, setContent] = useState("")
  const [image, setImage] = useState("")
  const [addPost, addPostResult] = useMutation(ADD_POST, {
    refetchQueries: [ { query: ALL_POSTS } ],
    onError: (error) => {
      setMessageHeader(error.graphQLErrors[0].message)
      emptyMessageHeader()
    }
  })

  useEffect(() => {
    if (addPostResult.data) {
      console.log("POSt added", addPostResult.data.addPost)
      setMessageHeader("Post added successfully!")
      emptyMessageHeader()
    }
  }, [addPostResult.data])

  const user = useSelector(state => state.user)

  const submit = () => {
    setShowModal(false)
    addPost({variables: {content, file: image}})
    setMessageHeader("Adding post...")
    setImage("")
  }

  const contentOnChange = (event) => {
    const content = event.target.value
    setContent(content)
    if( content.substr(0,content.length).match(/(?:^|\r?\n\s*)$/)
       && content.substr(content.length).match(/^(?:\s*\r?\n|$)/)) {
         console.log("empty")
      }
  }

  if (showModal && user) {
    const firstName = user.name.split(" ")[0]

    const placeholderText = `What is on your mind, ${firstName}?`
    return (
      <Modal
          size="lg"
          show={showModal}
          onHide={() => setShowModal(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Add Post
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={submit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Content</Form.Label>
                <Form.Control required as="textarea" rows="2" placeholder={placeholderText} onChange={contentOnChange}/>

              </Form.Group>
              <Form.Group controlId="formImage">
                <Form.Label>Image</Form.Label>
                <UploadPicture setImage={setImage} image={image}/>
                {image
                  ?
                <div className="addpost-image-container">
                  <img className="addpost-image" src={URL.createObjectURL(image)} />
                  <Button icon='close' onClick={() => setImage("")}/>
                </div>
                :
                null
                }
              </Form.Group>
              <Button primary type="submit" disabled={content === "" ? true : false}>
                Submit
              </Button>
            </Form>
          </Modal.Body>
      </Modal>
    )
  } else {
    return null
  }
}

export default AddPostModal
