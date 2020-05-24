const usersReducer = (state = [], action) => {
  switch (action.type) {
    case "INIT_USERS":
      console.log("data in init users", action.data)
      return action.data.data.allUsers
    default:
  }
  return state
}

export const initializeUsers = (users) => {
  return {
    type: "INIT_USERS",
    data: users
  }
}

export default usersReducer
