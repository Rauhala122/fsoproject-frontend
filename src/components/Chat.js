import React, {useState, useEffect, useRef} from 'react'
import { useMutation } from '@apollo/client'
import {ADD_MESSAGE} from '../queries'
import { Button, Comment, Form, Header } from 'semantic-ui-react'
import {setPublishedTime} from '../helpers/setPublishedTime'
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({messages, user}) => {

  const [message, setMessage] = useState("")
  const [addMessage, addMessageResult] = useMutation(ADD_MESSAGE, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  })

  const messageGroup = useRef(null)

  const scrollToBottom = () => {
    messageGroup.current.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (addMessageResult.data) {
      setMessage("")
    }
  }, [addMessageResult.data])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const submit = (e) => {
    e.preventDefault()
    addMessage({variables: {message}})
  }


  if (!user) {
    return null
  }

  return (
    <div>
      <Comment.Group>
        <div className="messageContainer">
        {messages.map(message =>
            <Comment className={user.username === message.user.username ? 'rightMessage justifyEnd' : 'leftMessage justifyStart'}>
              <div className={user.username === message.user.username ? 'messageBox messageBoxBlue' : 'messageBox'}>
                <Comment.Avatar src={message.user.profilePicture ? message.user.profilePicture.imageUrl : null}/>
                <Comment.Content className="pl-5">
                  <Comment.Author as='a'>{message.user.name}</Comment.Author>
                  <Comment.Metadata>
                    <div>{setPublishedTime(message)}</div>
                  </Comment.Metadata>
                  <Comment.Text>{message.message}</Comment.Text>
                </Comment.Content>
              </div>
            </Comment>
        )}
        <div ref={messageGroup} />
        </div>
        <Form reply onSubmit={submit}>
          <Form.TextArea onChange={({target}) => setMessage(target.value)} placeholder="Add message..." value={message}/>
          <Button disabled={message ? false : true} content='Add Message' labelPosition='left' icon='edit' primary />
        </Form>
      </Comment.Group>
    </div>
  )
}

export default Chat
