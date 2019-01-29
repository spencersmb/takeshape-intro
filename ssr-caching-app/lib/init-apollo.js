import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost'
import fetch from 'isomorphic-unfetch'
import { endpointDev, endpointProd } from '../config'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create (initialState) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: process.env.NODE_ENV === 'development' ? endpointProd : endpointProd, // Server URL (must be absolute)
      // credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.TAKESHAPE_KEY
      }
    }),
    cache: new InMemoryCache().restore(initialState || {}),
    // request: operation => {
    //   operation.setContext({
    //     fetchOptions: {
    //       credentials: 'include',
    //     },
    //     initialState,
    //   })
    // },
  })
}

export default function initApollo (initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}