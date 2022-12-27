// We use apollo/link to print log when error occur at executing GraphQL operations,
// see docs to get more information:
// https://www.apollographql.com/docs/react/api/link/introduction
// https://www.apollographql.com/docs/react/data/error-handling/#advanced-error-handling-with-apollo-link

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  from,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { API_HOST, GCP_PROJECT_ID } from '../config'
const httpLink = new HttpLink({ uri: `https://${API_HOST}/api/graphql` })

const getTraceHeaderMiddleware = new ApolloLink((operation, forward) => {
  const globalLogFields = {}
  const headers = operation.getContext()?.headers
  const traceHeader = headers?.['X-Cloud-Trace-Context']
  if (headers && traceHeader) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
    operation.setContext({ globalLogFields })
  }

  return forward(operation)
})

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  const globalLogFields = operation.getContext()?.globalLogFields || {}

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
      ...globalLogFields,
    })
  )
})

const client = new ApolloClient({
  link: from([getTraceHeaderMiddleware, errorLink, httpLink]),
  cache: new InMemoryCache(),
})

export default client
