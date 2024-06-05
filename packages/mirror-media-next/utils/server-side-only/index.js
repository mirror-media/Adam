import { URL, URLSearchParams } from 'node:url'

/**
 * @param {string} resolvedUrl
 * @param {import('node:querystring').ParsedUrlQuery} query
 * @returns {string}
 */
const getLoginUrl = (resolvedUrl, query) => {
  const searchParamsObject = new URLSearchParams(query)
  searchParamsObject.set(
    'destination',
    new URL(resolvedUrl, 'https://www.google.com').pathname
  )
  const searchParams = searchParamsObject.toString()
  return `/login?${searchParams}`
}

export { getLoginUrl }
