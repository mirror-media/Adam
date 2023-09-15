import ApolloLinkTimeout from 'apollo-link-timeout'
import { HttpLink } from '@apollo/client'

import { ApolloClient, InMemoryCache, concat } from '@apollo/client'

import {
  API_TIMEOUT_GRAPHQL,
  WEEKLY_API_SERVER_ORIGIN,
} from '../config/index.mjs'

const httpLink = new HttpLink({
  uri: `https://${WEEKLY_API_SERVER_ORIGIN}/content/graphql`,
})

const timeoutLink = new ApolloLinkTimeout(API_TIMEOUT_GRAPHQL)

const client = new ApolloClient({
  link: concat(timeoutLink, httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
  },
})

export default client
