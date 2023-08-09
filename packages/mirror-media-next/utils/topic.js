/**
 * @param {string} css custom css set for topic
 * @returns {string | undefined}
 */
export function parseUrl(css) {
  if (!css) {
    return
  }
  const regex = /(?<=url\()[^)]+(?=\))/

  const match = css.match(regex)
  if (match && match.length > 0) {
    const link = match[0]
    return link
  } else {
    return
  }
}
