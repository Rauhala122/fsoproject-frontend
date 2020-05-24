import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache
} from '@apollo/client'
import { setContext } from 'apollo-link-context'
import { createUploadLink } from 'apollo-upload-client'
import store from './store.js'
import { Provider } from 'react-redux'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const link = createUploadLink({ uri: 'http://localhost:4000/graphql' })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link)
})

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>,
  document.getElementById('root')
)
