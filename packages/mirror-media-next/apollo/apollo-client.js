import ApolloLinkTimeout from 'apollo-link-timeout'
import { HttpLink } from '@apollo/client'
import { IS_PREVIEW_MODE } from '../config/index.mjs'
import { ApolloClient, InMemoryCache, concat } from '@apollo/client'
import {
  API_TIMEOUT_GRAPHQL,
  WEEKLY_API_SERVER_ORIGIN,
  PREVIEW_SERVER_ORIGIN,
} from '../config/index.mjs'

const DEFAULT_URI = '/graphql'
const serverOrigin = IS_PREVIEW_MODE
  ? `https://${PREVIEW_SERVER_ORIGIN}`
  : `https://${WEEKLY_API_SERVER_ORIGIN}`

/**
 * Because we have two GraphQL endpoint, `/content/graphql` and `/member/graphql`,
 * we need to change endpoint by using `context.uri` in `client.query`.
 *
 * @typedef {import('@apollo/client').HttpOptions} HttpOptions
 * @type {HttpOptions['fetch']}
 */
const customFetch = (uri, options) => {
  let endpoint

  if (IS_PREVIEW_MODE) {
    // in preview, we fetch data from CMS directly
    endpoint = `${serverOrigin}/api/graphql`
  } else {
    endpoint =
      uri === DEFAULT_URI
        ? `${serverOrigin}/content/graphql`
        : `${serverOrigin}${uri}`
  }
  return fetch(endpoint, options)
}
const timeoutLink = new ApolloLinkTimeout(API_TIMEOUT_GRAPHQL)

const httpLink = new HttpLink({ fetch: customFetch })

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
