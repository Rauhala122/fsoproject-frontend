import React, {useState, useEffect} from 'react'
import { useMutation } from '@apollo/client'
import { Form, Button } from 'react-bootstrap';
import {LOGIN} from '../queries'
import {
  Link, useHistory
} from "react-router-dom"

const LoginForm = ({setToken, refetchUser, setError}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('user-token', token)
      refetchUser()
      history.push("/")
    }
  }, [result.data]) // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault()
    console.log(username, password)
    login({ variables: { username, password } })
  }

  const setForm = () => {
    return (
      <Form onSubmit={submit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" onChange={({target}) => setUsername(target.value)} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={({target}) => setPassword(target.value)}/>
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Link to="/signup">Sign Up</Link>
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    )
  }

  return (
    <div>
      {setForm()}
    </div>
  )
}

export default LoginForm
