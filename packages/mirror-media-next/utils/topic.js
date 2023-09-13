/**
 * @param {string} css custom css set for topic
 * @returns {string | undefined}
 */
export function parseUrl(css) {
  if (!css) {
    return
  }

  // fix ref: https://stackoverflow.com/questions/51568821/works-in-chrome-but-breaks-in-safari-invalid-regular-expression-invalid-group
  const regex = /(?:url\()[^)]+(?=\))/

  const match = css.match(regex)

  if (match && match.length > 0) {
    const link = match[0]
    return link
  } else {
    return
  }
}
