import { gql  } from '@apollo/client'

const COMMENT_DETAILS = gql`
  fragment CommentDetails on Comment {
    content
    date
    id
    user {
      id
      username
      profilePicture {
        imageUrl
      }
    }
  }
`

const POST_DETAILS = gql`
  fragment PostDetails on Post {
    content
    date
    time
    id
    image {
      imageUrl
    }
    user {
      id
      username
      name
      profilePicture {
        imageUrl
      }
    }
    comments {
      content
      date
      user {
        username
        profilePicture {
          imageUrl
        }
      }
    }
    likes {
      date
      time
      id
      user {
        id
        username
        profilePicture {
          imageUrl
        }
      }
    }
  }
`

const MESSAGE_DETAILS = gql`
  fragment MessageDetails on Message {
    message
    id
    date
    user {
      name
      id
      username
      profilePicture {
        imageUrl
      }
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const CREATE_USER = gql`
  mutation createUser($name: String!, $username: String!, $password: String!, $description: String!, $country: String!, $city: String!, $born: String!) {
    createUser(name: $name, username: $username, password: $password, description: $description, country: $country, city: $city, born: $born) {
      username
      name
    }
  }
`

export const ADD_LIKE = gql`
  mutation addLike($post: String!) {
    addLike(post: $post) {
      id
      user {
        id
        username
      }
    }
  }
`

export const ADD_COMMENT = gql`
  mutation addComment($post: String!, $content: String!) {
    addComment(post: $post, content: $content) {
      ...CommentDetails
    }
  }
  ${COMMENT_DETAILS}
`

export const ALL_COMMENTS = gql`
  query allComments($post: String){
    allComments(post: $post) {
      ...CommentDetails
    }
  }
  ${COMMENT_DETAILS}
`

export const UPLOAD_FILE = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      imageUrl
      imageType
    }
  }
`

export const FILES = gql`
  query {
    files
  }
`

export const UPLOADS = gql`
  query {
    profilePictures {
      imageType
      imageUrl
      user {
        username
      }
    }
  }
`

export const UNLIKE = gql`
  mutation unlike($post: String!) {
    unlike(post: $post) {
      id
      user {
        id
        username
      }
    }
  }
`

export const DELETE_POST = gql`
  mutation deletePost($post: String!) {
    deletePost(post: $post) {
      id
      content
      user {
        id
        username
      }
    }
  }
`

export const ADD_POST = gql`
  mutation addPost($content: String!, $file: Upload) {
    addPost(content: $content, file: $file) {
      ...PostDetails
    }
  }
  ${POST_DETAILS}
`

export const ADD_MESSAGE = gql`
  mutation addMessage($message: String!) {
    addMessage(message: $message) {
      ...MessageDetails
    }
  }
  ${MESSAGE_DETAILS}
`

export const ALL_MESSAGES = gql`
  query {
    allMessages {
      ...MessageDetails
    }
  }
  ${MESSAGE_DETAILS}
`

export const MESSAGE_ADDED = gql`
  subscription {
    messageAdded {
      ...MessageDetails
    }
  }
  ${MESSAGE_DETAILS}
`

export const ALL_USERS = gql`
  query {
    allUsers  {
      name
      username
      id
      description
      born
      country
      city
      profilePicture {
        imageUrl
      }
      posts {
        content
      }
    }
  }
`

export const ALL_POSTS = gql`
  query {
    allPosts {
      ...PostDetails
    }
  }
  ${POST_DETAILS}
`

export const GET_USER = gql`
  query {
    me {
      id
      username
      name
      posts {
        content
      }
      profilePicture {
        imageUrl
      }
    }
  }
`

export const POST_ADDED = gql`
  subscription {
    postAdded {
      ...PostDetails
    }
  }
  ${POST_DETAILS}
`
