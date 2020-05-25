import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {
  ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split, ApolloLink
} from '@apollo/client'
import { setContext } from 'apollo-link-context'
import { createUploadLink } from 'apollo-upload-client'
import store from './store.js'
import { Provider } from 'react-redux'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/link-ws'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const httpLink = createUploadLink({ uri: 'http://localhost:4000/graphql' })

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true
  }
})
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
)

const link = ApolloLink.from([splitLink]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>,
  document.getElementById('root')
)
