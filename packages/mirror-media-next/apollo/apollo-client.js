import { HttpLink } from '@apollo/client'
import { ApolloClient, concat, InMemoryCache } from '@apollo/client'
import ApolloLinkTimeout from 'apollo-link-timeout'

import { IS_PREVIEW_MODE } from '../config/index.mjs'
import { API_TIMEOUT_GRAPHQL, PREVIEW_SERVER_ORIGIN } from '../config/index.mjs'
import { getWeeklyApiServerBaseUrl } from '../utils/weekly-api-server-url'

const DEFAULT_URI = '/graphql'
const previewServerOrigin = `https://${PREVIEW_SERVER_ORIGIN}`

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
    endpoint = `${previewServerOrigin}/api/graphql`
    // The internal key is only meaningful to the weekly-api-server proxy;
    // never forward it to the preview CMS.
    if (options?.headers) {
      delete options.headers['X-Internal-Api-Key']
      delete options.headers['x-internal-api-key']
    }
  } else {
    // Resolved per request: in the browser it depends on the runtime config
    // element rendered by _document.
    const serverOrigin = getWeeklyApiServerBaseUrl()
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
    query: {
      fetchPolicy: 'no-cache',
    },
  },
})

/**
 * @typedef {import('@apollo/client').NormalizedCacheObject} NormalizedCacheObject
 * @type {ApolloClient<NormalizedCacheObject> | null}
 */
let storyClientInstance = null

/**
 * Get or create a singleton ApolloClient instance for STORY_GQL_ENDPOINT.
 * This avoids creating a new client instance on every request.
 * @param {string} endpoint - The GraphQL endpoint URL
 * @returns {ApolloClient<NormalizedCacheObject> | null} - The ApolloClient instance, or null if endpoint is not provided
 */
export function getStoryClient(endpoint) {
  if (!endpoint || typeof window !== 'undefined') {
    return null
  }

  if (!storyClientInstance) {
    storyClientInstance = new ApolloClient({
      link: concat(
        new ApolloLinkTimeout(API_TIMEOUT_GRAPHQL),
        new HttpLink({
          uri: endpoint,
          fetch,
        })
      ),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
        },
        query: {
          fetchPolicy: 'no-cache',
        },
      },
    })
  }

  return storyClientInstance
}

export default client
