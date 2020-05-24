import React, {useState, useEffect} from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import LoginForm from './components/LoginForm'
import {ALL_USERS, ALL_POSTS, GET_USER, UPLOADS} from './queries'
import './index.css'
import { Alert, Button } from 'react-bootstrap';
import { Icon } from 'semantic-ui-react';
import {
  BrowserRouter as Router,
  Switch, Route, Link, Redirect
} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import SignupForm from './components/SignupForm'
import Homepage from './components/Homepage'
import AddPostModal from './components/AddPostModal'
import Users from './components/Users'
import User from './components/User'
import {initializePosts} from './reducers/postsReducer'
import {initializeUser, clearUser} from './reducers/userReducer'
import {initializeUsers} from './reducers/usersReducer'
import {Message} from 'semantic-ui-react'


const App = () => {

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const users = useQuery(ALL_USERS)
  const posts = useQuery(ALL_POSTS)
  const uploads = useQuery(UPLOADS)
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const [errorMessage, setErrorMessage] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [messageHeader, setMessageHeader] = useState("")
  const [messageContent, setMessageContent] = useState("")

  const {loading, error, data, refetch, networkStatus} = useQuery(GET_USER, {
    notifyOnNetworkStatusChange: true,
  })

  document.title = "Social Media App"

  const emptyMessageHeader = () => {
    setTimeout(() => {
      setMessageHeader("")
    }, 3000)
  }

  const refetchUser = () => {
    refetch()
  }

  useEffect(() => {
    const token = localStorage.getItem('user-token')
    if ( token ) {
      setToken(token)
    }
  }, [])

  if (networkStatus === 4) return <div className="loader"></div>;

  if (posts.loading || uploads.loading || users.loading || loading) {
    return <div className="loader"></div>
  } else {
    dispatch(initializePosts(posts))
    dispatch(initializeUsers(users))
    dispatch(initializeUser(data))
  }

  const notify = (message) => {
    setErrorMessage(message)
    console.log("MME")
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const Notify = ({errorMessage}) => {
    if ( !errorMessage ) {
      return null
    }
    return (
      <Alert variant="danger">
        {errorMessage}
      </Alert>
    )
  }

  const logout = () => {
    setToken(null)
    dispatch(clearUser())
    localStorage.clear()
    client.resetStore()
  }

  const loginForm = () => {
    return (
      <div>
        <LoginForm setToken={setToken} refetchUser={refetchUser} setError={notify}/>
      </div>
    )
  }

  const renderHomepage = () => {
    if (!token) {
      return (
        <Redirect to='/login' />
      )
    } else {
      return (
        <div>
          <Homepage logout={logout} setMessageHeader={setMessageHeader} setMessageContent={setMessageContent} emptyMessageHeader={emptyMessageHeader}/>
        </div>
      )
    }
  }

  return (
    <div className="container">
      <Router>
        <Link className="homeLink" to="/"><h1 className="center">Social Media App</h1></Link>
        <Notify errorMessage={errorMessage}/>
        <AddPostModal showModal={showModal} setShowModal={setShowModal} setMessageContent={setMessageContent} setMessageHeader={setMessageHeader} emptyMessageHeader={emptyMessageHeader}/>
        {user ?
        <div className="homepage-actions">
          {user ? <p>{user.profilePicture ? <img src={user.profilePicture.imageUrl} className="profile-picture"/> : <Icon name="user" size='small'/>} <strong>Welcome back {user.name}!</strong></p> : null}
          <Button variant="secondary" onClick={logout}>Log out</Button>
          <Link to="/"><Button variant="primary" className="margin-left-10">Home</Button></Link>
          <Link to="/users"><Button variant="primary" className="margin-left-10">Users</Button></Link>
        </div>
        :
        null
        }
        <Switch>

          <Route path="/login">
            {loginForm()}
          </Route>

          <Route path="/signup">
            <SignupForm setError={setErrorMessage} setToken={setToken} refetchUser={refetchUser}/>
          </Route>

          <Route path="/users/:id">
            {token ? <User setMessageHeader={setMessageHeader} emptyMessageHeader={emptyMessageHeader} /> : <Redirect to="/login"/>}
          </Route>

          <Route path="/users">
            {token ? <Users/> : <Redirect to='/login' />}
          </Route>

          <Route path="/">
            <Button variant="primary" className="add-post-button" onClick={() => setShowModal(true)}>Add Post</Button>

            {renderHomepage()}
          </Route>
        </Switch>
      </Router>
      {messageHeader !== ""
      ?
        <Message
          className="message"
          color="black"
          header={messageHeader}
          content={messageContent}
        />
      :
      null
      }
    </div>
  )
}

export default App
