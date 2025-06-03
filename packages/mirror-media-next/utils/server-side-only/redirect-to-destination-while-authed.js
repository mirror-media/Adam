import { URLSearchParams, URL } from 'node:url'
import withUserSSR from './with-user-ssr'

/**
 * @typedef {import('querystring').ParsedUrlQuery} ParsedUrlQuery
 * @typedef {import('next').Redirect} Redirect
 * @typedef {import('next').PreviewData} PreviewData
 * @typedef {import('firebase-admin/auth').DecodedIdToken} DecodedIdToken
 */

/**
 * @template [T=any]
 * @typedef {import('./with-user-ssr').Dictionary} Dictionary
 */

/**
 * @template P
 * @typedef {import('./with-user-ssr').GetSSRProps<P>} GetSSRProps
 */

/**
 * @template P
 * @typedef {import('./with-user-ssr').GetSSRResult<P>} GetSSRResult
 */

/**
 * @template {ParsedUrlQuery} [Q=ParsedUrlQuery]
 * @template {PreviewData} [D=PreviewData]
 * @typedef {import('next').GetServerSidePropsContext<Q, D> & { user?: DecodedIdToken}} SSRPropsContext
 */

/**
 * @template P
 * @template {ParsedUrlQuery} Q
 * @template {PreviewData} D
 * @typedef {import('./with-user-ssr').SSRPropsGetter<P, Q, D>} SSRPropsGetter
 */

/**
 * Normalizes the destination from query parameters to be a path on the current domain,
 * merging other original query parameters.
 * @param {ParsedUrlQuery} currentQuery The current query object from context.
 * @param {import('http').IncomingMessage['headers']} reqHeaders The request headers.
 * @returns {{finalPathAndQuery: string, finalFullUrl: string | null}}
 */
function normalizeDestination(currentQuery, reqHeaders) {
  const protocol = reqHeaders['x-forwarded-proto']?.toString() || 'http'
  const host = reqHeaders.host

  let targetPath = '/premiumsection/member' // Default path
  let queryParamsFromDestination = new URLSearchParams()

  const destinationValue = currentQuery.destination
  if (destinationValue) {
    const destString = Array.isArray(destinationValue)
      ? destinationValue[0]
      : destinationValue
    if (typeof destString === 'string' && destString.trim() !== '') {
      try {
        // Try to parse as a full URL first
        const fullUrl = new URL(destString)
        targetPath = fullUrl.pathname
        queryParamsFromDestination = new URLSearchParams(fullUrl.search)
      } catch (e) {
        // If not a full URL, treat as a path (may include query string)
        // Use a dummy base to parse path and its query string separately
        try {
          const pathOnlyUrl = new URL(destString, 'http://dummybase')
          targetPath = pathOnlyUrl.pathname
          queryParamsFromDestination = new URLSearchParams(pathOnlyUrl.search)
        } catch (parseError) {
          // If destString is not a valid path or URL component, stick to default.
          // console.warn('Could not parse destination as URL or path:', destString, parseError);
        }
      }
    }
  }

  // Merge query parameters: start with those from the destination,
  // then add/override with any other parameters from the original request.
  const finalSearchParams = new URLSearchParams(queryParamsFromDestination)
  const originalRequestParams = new URLSearchParams(
    /** @type {Record<string, string | string[]>} */ (currentQuery)
  )
  originalRequestParams.delete('destination') // Don't re-add 'destination' itself

  originalRequestParams.forEach((value, key) => {
    finalSearchParams.set(key, value)
  })

  const finalQueryString = finalSearchParams.toString()
  const finalPathAndQuery =
    targetPath + (finalQueryString ? `?${finalQueryString}` : '')

  let finalFullUrl = null
  if (host) {
    finalFullUrl = `${protocol}://${host}${finalPathAndQuery}`
  }

  return { finalPathAndQuery, finalFullUrl }
}

/**
 * @callback RedirectToDestinationWhileAuthed
 * @returns {
    <P extends Dictionary=Dictionary,
     Q extends ParsedUrlQuery=ParsedUrlQuery,
     D extends PreviewData=PreviewData>
    (propGetter?: SSRPropsGetter<P, Q, D>)
     => import('next').GetServerSideProps<P, Q, D>
   }
 */

/**
 * should be used on SSR page which redirects user to `destination` route if authed
 *
 * @type {RedirectToDestinationWhileAuthed}
 */
const redirectToDestinationWhileAuthed =
  () =>
  /**
   * @template {Dictionary} P
   * @template {ParsedUrlQuery} Q
   * @template {PreviewData} D
   */
  (
    /** @type {import('next').GetServerSideProps<P, Q, D>} */ getServerSidePropsFunc
  ) =>
    withUserSSR()(async (/** @type {SSRPropsContext<Q, D>} */ ctx) => {
      const { query, user, req } = ctx

      const { finalPathAndQuery, finalFullUrl } = normalizeDestination(
        query,
        req.headers
      )

      const originalDestQueryValue = query.destination
      let originalDestString = ''
      if (Array.isArray(originalDestQueryValue)) {
        originalDestString = originalDestQueryValue[0] || ''
      } else if (typeof originalDestQueryValue === 'string') {
        originalDestString = originalDestQueryValue
      }

      // Check if an intermediate redirect to normalize the destination in the URL is needed.
      if (
        originalDestQueryValue && // A destination was provided.
        finalFullUrl && // We were able to construct a full normalized URL.
        originalDestString !== finalFullUrl // The original is different from the normalized full URL.
      ) {
        // Preserve all other original query parameters for the intermediate redirect.
        const intermediateRedirectParams = new URLSearchParams(
          /** @type {Record<string, string | string[]>} */ (query)
        )
        intermediateRedirectParams.set('destination', finalFullUrl) // Set the new, normalized destination value.

        return {
          redirect: {
            statusCode: 307, // Temporary redirect.
            // Redirect to the same login page, but with the destination query param rewritten.
            destination: `/login?${intermediateRedirectParams.toString()}`,
          },
        }
      }

      // If no intermediate redirect was needed (or it has already occurred),
      // proceed with the main logic.
      if (user) {
        // User is authenticated, redirect server-side to the actual target.
        const ultimateRedirectTarget = finalFullUrl || finalPathAndQuery
        return {
          redirect: {
            statusCode: 307,
            destination: ultimateRedirectTarget,
          },
        }
      } else {
        // User is NOT authenticated.
        // The page's getServerSideProps should receive the normalized destination.
        // If an intermediate redirect just occurred, query.destination will already be finalFullUrl.
        // If no intermediate redirect was needed, query.destination was already correct or not provided.
        // We ensure the context passed to the page has the fully resolved (and potentially rewritten) destination.
        const contextForPage = {
          ...ctx,
          query: { ...query, destination: finalFullUrl || finalPathAndQuery },
        }

        let props = /** @type {P} */ ({})
        if (getServerSidePropsFunc) {
          const composedProps = await getServerSidePropsFunc(contextForPage)

          if (composedProps) {
            if ('props' in composedProps) {
              props = await composedProps.props
              return {
                ...composedProps,
                props,
              }
            }
            if ('notFound' in composedProps || 'redirect' in composedProps) {
              return { ...composedProps }
            }
          }
        }
        return {
          props,
        }
      }
    })

export default redirectToDestinationWhileAuthed
