import ApolloLinkTimeout from 'apollo-link-timeout'
import { HttpLink } from '@apollo/client'
import { IS_PREVIEW_MODE } from '../config/index.mjs'
import { ApolloClient, InMemoryCache, concat } from '@apollo/client'

import {
  API_TIMEOUT_GRAPHQL,
  WEEKLY_API_SERVER_ORIGIN,
  PREVIEW_SERVER_ORIGIN,
} from '../config/index.mjs'

const httpLink = new HttpLink({
  uri: IS_PREVIEW_MODE
    ? `https://${PREVIEW_SERVER_ORIGIN}/api/graphql`
    : `https://${WEEKLY_API_SERVER_ORIGIN}/content/graphql`,
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
