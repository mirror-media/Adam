import axios from 'axios'
import { ApolloError } from '@apollo/client'

import { logAxiosError, logGenericError, logGqlError } from './log/shared'

/**
 * Unified handler for Promise.allSettled() results. Works for any transport.
 * T may be AxiosResponse, ApolloQueryResult, or a domain shape.
 * If the settled item is fulfilled, we map its value; otherwise we log by transport and
 * return the mapped fallback by calling `dataHandler(undefined)`.
 * @template T,V
 * @param {PromiseSettledResult<T>} response
 * @param {(value: T | undefined) => V} dataHandler
 * @param {string} errorMessage
 * @param {Record<string, any>} [traceObject]
 * @returns {V}
 */
const processSettledResult = (
  response,
  dataHandler,
  errorMessage,
  traceObject
) => {
  // PromiseSettledResult<T> is a closed union type:
  //     - PromiseFulfilledResult<T> has status: 'fulfilled'
  //     - PromiseRejectedResult     has status: 'rejected'
  // If we enter this branch, status is 'fulfilled'; otherwise it must be 'rejected'.

  if (response.status === 'fulfilled') {
    return dataHandler(response.value)
  }

  const reason = response.reason
  if (reason instanceof ApolloError) {
    logGqlError(reason, errorMessage, traceObject)
  } else if (
    typeof axios?.isAxiosError === 'function' &&
    axios.isAxiosError(reason)
  ) {
    logAxiosError(reason, errorMessage, traceObject)
  } else {
    // Third generic case: neither ApolloError nor AxiosError
    logGenericError(reason, errorMessage, traceObject)
  }

  return dataHandler(undefined)
}

export { processSettledResult }
