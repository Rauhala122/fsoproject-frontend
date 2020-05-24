import { gql  } from '@apollo/client'

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
      content
      date
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

export const ALL_COMMENTS = gql`
  query allComments($post: String){
    allComments(post: $post) {
      content
      date
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
      content
      date
      time
      id
      user {
        username
      }
      comments {
        content
      }
      likes {
        date
        time
        id
        user {
          id
          username
        }
      }
    }
  }
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
  }
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
