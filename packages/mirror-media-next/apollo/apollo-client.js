import { ApolloClient, InMemoryCache } from '@apollo/client'

import { API_HOST } from '../config'

const client = new ApolloClient({
  uri: `https://${API_HOST}/api/graphql`,
  cache: new InMemoryCache(),
})

export default client
