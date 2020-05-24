const postsReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_POSTS":
      let posts = action.data.data.allPosts
      const byDate = posts.slice(0)
      byDate.sort((a, b) => {
        const x = new Date(a.date).getTime()
        const y = new Date(b.date).getTime()
        return -(x - y)
      })
      return byDate
    case "ADD_LIKE":
      const id = action.data
      const post = state.find(p => p.id === id)
      const newPost = {...post, likes: post.likes + 1}
      console.log("New post", newPost)
      return state.map(p => p.id !== newPost.id ? p : newPost)
    case "ADD_POST":
      return [...state, action.data]
    default:
  }
  return state
}

export const initializePosts = (posts) => {
  return {
    type: "INIT_POSTS",
    data: posts
  }
}

export const addPost = (post) => {
  return async dispatch => {
    dispatch({
      type: "ADD_POST",
      data: post
    })
  }
}

export const addLike = (like) => {
  return {
    type: "ADD_LIKE",
    like: like
  }
}

export default postsReducer
