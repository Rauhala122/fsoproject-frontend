import React, {useState, useEffect} from 'react'
import { useMutation } from '@apollo/client'
import { Form, Button, Col } from 'react-bootstrap';
import {LOGIN, CREATE_USER, ALL_USERS} from '../queries'
import {
   Link, useHistory
} from "react-router-dom"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SignupForm = ({setError, setToken, refetchUser}) => {
  const history = useHistory()
  const [ createUser, result ] = useMutation(CREATE_USER, {
    refetchQueries: [ { query: ALL_USERS } ],
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })
  const [ login, logInResult ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [description, setDescription] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    if ( result.data ) {
      login({ variables: { username, password } })
    }
  }, [result.data]) // eslint-disable-line

  useEffect(() => {
    if ( logInResult.data ) {
      const token = logInResult.data.login.value
      setToken(token)
      localStorage.setItem('user-token', token)
      refetchUser()
      history.push("/")
    }
  }, [logInResult.data]) // eslint-disable-line

  const handleDateChange = date => {
    setDate(date)
  };

  const submit = (e) => {
    e.preventDefault()
    const name = firstName + " " + lastName
    const dateToString = date.toString()
    console.log(typeof dateToString)
    createUser({variables: {name, username, password, description, city, country, born: dateToString}})
  }

  return (
    <Form onSubmit={submit}>
      <Form.Row>
        <Form.Group as={Col} controlId="formBasicFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control required type="text" placeholder="First name" onChange={({target}) => setFirstName(target.value)} />
        </Form.Group>
        <Form.Group as={Col} controlId="formBasicLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control required type="text" placeholder="Last name" onChange={({target}) => setLastName(target.value)} />
        </Form.Group>
      </Form.Row>

      <Form.Group controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control required type="text" placeholder="Enter username" onChange={({target}) => setUsername(target.value)} />
      </Form.Group>

      <Form.Group controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description</Form.Label>
        <Form.Control required as="textarea" rows="2" placeholder="Description..." onChange={({target}) => setDescription(target.value)}/>
      </Form.Group>

      <Form.Row>
        <Form.Group as={Col} controlId="formGridCity">
          <Form.Label>City</Form.Label>
          <Form.Control required placeholder="City" onChange={({target}) => setCity(target.value)}/>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Country</Form.Label>
          <Form.Control required as="select" value={country} onChange={({target}) => setCountry(target.value)}>
            <option>Choose...</option>
            <option>Finland</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Sweden</option>
            <option>Norway</option>
            <option>Denmark</option>
          </Form.Control>
        </Form.Group>
      </Form.Row>

      <Form.Group controlId="exampleForm.ControlTextarea1">
        <Form.Label>Date of birth</Form.Label>
        <DatePicker
        required
        selected={date}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control required type="password" placeholder="Password" onChange={({target}) => setPassword(target.value)}/>
      </Form.Group>
      <Form.Group controlId="formBasicCheckbox">
        <Link to="/login">Login</Link>
      </Form.Group>
      <Button variant="primary" type="submit">
        Sign Up
      </Button>
    </Form>
  )
}

export default SignupForm
