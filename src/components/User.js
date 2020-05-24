import React, {useEffect, useState} from 'react'
import {
  useParams
} from "react-router-dom"
import {UPLOAD_FILE, GET_USER} from '../queries'
import { useMutation} from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import {Icon, Item, Button} from 'semantic-ui-react'
import {setPublishedTime} from '../helpers/setPublishedTime'

const User = ({setMessageHeader, emptyMessageHeader}) => {
  const [signleUpload, uploadFileResult] = useMutation(UPLOAD_FILE, {
    refetchQueries: [ { query: GET_USER } ],
    onError: (error) => {
      setMessageHeader(error.graphQLErrors[0].message)
      emptyMessageHeader()
    }
  })
  const id = useParams().id
  const users = useSelector(state => state.users)
  const currentUser = useSelector(state => state.user)
  const user = users.find(user => user.id === id)
  const [image, setImage] = useState("")

  useEffect(() => {
    if (uploadFileResult.data) {
      setMessageHeader("Profile picture changed")
      emptyMessageHeader()
    }
  }, [uploadFileResult.data])

  if (!user) {
    return (
      <h1>This user was not found</h1>
    )
  }

  return (
    <div>
    <Item.Group>
      <Item>
        <div className="profilePictureContainer">
          {user.profilePicture ? <Item.Image size="medium" src={image ? URL.createObjectURL(image) : user.profilePicture.imageUrl}/> : <Icon name="user" size='small'/>}
            {user.id === currentUser.id ? <Button icon='photo' onClick={({target}) => {
              const fileInput = document.getElementById("profilePictureInput")
              console.log(fileInput)
              fileInput.click()
            }} /> : null}

            <input
            id="profilePictureInput"
            type="file"
            onChange={({ target: { validity, files: [file] } }) => {
              validity.valid && signleUpload({ variables: { file } }) && setImage(file)
            }}
            />
        </div>
        <Item.Content className="profileContent">
          <Item.Header>{user.name} | @{user.username}</Item.Header>
          <Item.Meta className="profileMeta">
            <p className='stay'>{setPublishedTime({date: user.born}).split(" ").map((word, i) => i<2 ? word + " " : null)} old</p>
            <p>Lives in {user.city}, {user.country}</p>
          </Item.Meta>
          <Item.Description className="profileDescription">{user.description}</Item.Description>
        </Item.Content>
      </Item>
    </Item.Group>
    </div>
  )
}

export default User
