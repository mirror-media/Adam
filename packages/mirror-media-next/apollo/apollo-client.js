import { ApolloClient, InMemoryCache } from '@apollo/client'

import { WEEKLY_API_SERVER_ORIGIN } from '../config/index.mjs'

const client = new ApolloClient({
  uri: `https://${WEEKLY_API_SERVER_ORIGIN}/content/graphql`,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
  },
})

export default client
