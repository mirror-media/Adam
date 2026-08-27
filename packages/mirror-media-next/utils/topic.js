/**
 * Extract the first `url(...)` from CMS custom CSS.
 * Used as a truthy check for "style already has a background image",
 * and as a fallback image URL for SEO / topic index cards.
 *
 * @param {string} css custom css set for topic
 * @returns {string | undefined}
 */
export function parseUrl(css) {
  if (!css) {
    return
  }

  // Avoid lookbehind for Safari: https://stackoverflow.com/questions/51568821/works-in-chrome-but-breaks-in-safari-invalid-regular-expression-invalid-group
  const match = css.match(/url\(\s*['"]?([^)'"]+)['"]?\s*\)/)

  if (match?.[1]) {
    return match[1].trim()
  }
}
