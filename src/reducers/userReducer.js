const userReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_USER":
      return action.data.me
    case "CLEAR_USER":
      return null
    default:
  }
  return state
}

export const initializeUser = (user) => {
  return {
    type: "INIT_USER",
    data: user
  }
}
export const clearUser = () => {
  return {
    type: "CLEAR_USER"
  }
}

export default userReducer
