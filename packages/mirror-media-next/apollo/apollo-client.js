import { ApolloClient, InMemoryCache } from '@apollo/client'
import errors from '@twreporter/errors'
import { API_HOST } from '../config/index.mjs'

const client = new ApolloClient({
  uri: `https://${API_HOST}/api/graphql`,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
  },
})
/**
 * TODO: solve type problem in `queryOption?.query?.definitions[0]?.name?.value`, not just using `@ts-ignore`
 * Function for handle apollo query request.
 * Return result if request is succeed; throws an error if failed.
 * Error is wrapped by `@twreporter/errors`
 * @async
 * @param {import('@apollo/client').QueryOptions} queryOption - Option for queries. See [doc](https://www.apollographql.com/docs/react/data/queries/) to get detail.
 * @param {{ 'logging.googleapis.com/trace': string } | {}} [globalLogFields]
 * - When an error is thrown, identify which request occurred error.
 * - You can get the value by using function `getGlobalLogFields` in `utils/log.js`.
 * @returns {Promise<import('@apollo/client').ApolloQueryResult<any>>}
 * @throws {Error}
 */
export const clientQuery = async (queryOption, globalLogFields = {}) => {
  try {
    const result = await client.query(queryOption)
    return result
  } catch (err) {
    /**
     * @type {import('@apollo/client').ApolloError}
     */
    const { graphQLErrors, clientErrors, networkError } = err

    const queryName =
      // @ts-ignore
      queryOption?.query?.definitions[0]?.name?.value || 'unknown query'

    const annotatingError = errors.helpers.wrap(
      err,
      'ApolloError',
      `Error occurs when using Apollo Client query ${queryName} `
    )
    throw new Error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(
          annotatingError,
          {
            withStack: true,
            withPayload: true,
          },
          0,
          0
        ),
        debugPayload: {
          graphQLErrors,
          clientErrors,
          networkError,
        },
        ...globalLogFields,
      })
    )
  }
}
export default client
