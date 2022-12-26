// We use apollo/link to print log when error occur at executing GraphQL operations,
// see docs to get more information:
// https://www.apollographql.com/docs/react/data/error-handling/#advanced-error-handling-with-apollo-link

import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { API_HOST } from '../config'

const httpLink = new HttpLink({ uri: `https://${API_HOST}/api/graphql` })

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  let debugPayload = {
    graphQLOperationName: operation.operationName,
    graphQLErrors: [],
    networkError: '',
  }

  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      debugPayload.graphQLErrors.push({
        Message: message,
        Location: JSON.stringify(locations),
        Path: `${path}`,
      })
    })

  if (networkError) {
    debugPayload.networkError = `${networkError}`
  }
  console.error(
    JSON.stringify({
      severity: 'ERROR',
      message: `[Error] Fetch graphQL failed`,
      debugPayload,
    })
  )
})

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
})

export default client
