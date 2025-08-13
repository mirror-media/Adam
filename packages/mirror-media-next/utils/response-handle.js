import axios from 'axios'
import { ApolloError } from '@apollo/client'

import { logAxiosError, logGenericError, logGqlError } from './log/shared'

/**
 * @template {import('axios').AxiosResponse['data']} T
 * @template {PromiseSettledResult<T>} U
 * @template V
 *
 * @param {U} response
 * @param {(value: T | undefined) => V} dataHandler
 * @param {Parameters<typeof logAxiosError>[1]} errorMessage
 * @param {Parameters<typeof logAxiosError>[2]} [traceObject]
 */
const handleAxiosResponse = (
  response,
  dataHandler,
  errorMessage,
  traceObject
) => {
  if (response.status === 'fulfilled') {
    return dataHandler(response.value)
  } else if (response.status === 'rejected') {
    logAxiosError(response.reason, errorMessage, traceObject)
  }
  return dataHandler(undefined)
}

/**
 * @template S
 * @template {import('@apollo/client').ApolloQueryResult<S>} T
 * @template {PromiseSettledResult<T>} U
 * @template V
 *
 * @param {U} response
 * @param {(value: T | undefined) => V} dataHandler
 * @param {Parameters<typeof logGqlError>[1]} errorMessage
 * @param {Parameters<typeof logGqlError>[2]} [traceObject]
 */
const handleGqlResponse = (
  response,
  dataHandler,
  errorMessage,
  traceObject
) => {
  if (response.status === 'fulfilled') {
    return dataHandler(response.value)
  } else if (response.status === 'rejected') {
    logGqlError(response.reason, errorMessage, traceObject)
  }
  return dataHandler(undefined)
}

/**
 * Unified settled-result handler with transport-aware logging.
 * @template T,V
 * @param {PromiseSettledResult<T>} response
 * @param {(value: T | undefined) => V} dataHandler
 * @param {string} errorMessage
 * @param {Record<string, any>} [traceObject]
 * @returns {V}
 */
const handleSettledResponse = (
  response,
  dataHandler,
  errorMessage,
  traceObject
) => {
  // PromiseSettledResult<T> is a closed union type:
  //     - PromiseFulfilledResult<T> has status: 'fulfilled'
  //     - PromiseRejectedResult    has status: 'rejected'
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

export { handleAxiosResponse, handleGqlResponse, handleSettledResponse }
