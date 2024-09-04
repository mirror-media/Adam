/**
 * @param {string} resolvedUrl
 * @returns {string}
 */
const getLoginUrl = (resolvedUrl) => {
  return `/login?destination=${encodeURIComponent(resolvedUrl)}`
}

export { getLoginUrl }
