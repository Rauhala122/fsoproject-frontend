import React, {useState, useEffect} from 'react'
import { Card, Image, Input } from 'semantic-ui-react';
import { Col, Row } from 'react-bootstrap';
import {
  Link
} from "react-router-dom"
import { useSelector } from 'react-redux'

const Users = ({logout}) => {

  const allUsers = useSelector(state => state.users)

  const [users, setUsers] = useState(allUsers.filter(user => user.id !== ""))
  const [search, setSearch] = useState([])

  console.log("USers ", users)

  users.filter(user => user.name === "Saska Rauhala")

  const filterUsers = (e) => {
    setSearch(e.target.value.toLowerCase().split(" "))
  }

  console.log("Users", allUsers)

  useEffect(() => {
    if (search.length === 0 || (search.length === 1 && search[0] === "")) {
      setUsers(allUsers.filter(user => user.id !== ""))
    } else {
      setUsers(allUsers.filter(user => {
        const f = search.some(val => val !== "" ? user.name.toLowerCase().indexOf(val) !== -1 : null)
        return f
      }).filter(user => search.some(val => val !== "" ? user.name.toLowerCase().indexOf(val) !== -1 : null)))
    }
  }, [search])

  return (
    <div className="users-container">
      {search.length}
      <div className="search-container">
        <Input icon="search" placeholder='Search users...' id="search-input" onChange={filterUsers}/>
      </div>
      <Row className="users-row">
      {users.map((user, i) =>
          <Col sm={12} md={6} lg={4} className="user-card">
          <Card className="users-card-content">
            {user.profilePicture ? <Image src={user.profilePicture.imageUrl} wrapped ui={false} /> : null}
            <Card.Content>
              <Card.Header><Link className="userLink" to={`/users/${user.id}`}>{user.name}</Link></Card.Header>
              <Card.Meta>
                <span className='date'>@{user.username}</span>
              </Card.Meta>
              <Card.Description className="card-description">
                {user.description}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              {user.posts.length} {user.posts.length === 1 ? "post" : "posts"}
            </Card.Content>
          </Card>
          </Col>
      )}
      </Row>
    </div>
  )
}

export default Users
