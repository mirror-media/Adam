import { URL, URLSearchParams } from 'node:url'

import type { GetServerSideProps, PreviewData } from 'next'
import type { IncomingHttpHeaders } from 'http'
import type { ParsedUrlQuery } from 'querystring'

import type {
  Dictionary,
  SSRPropsContext,
  SSRPropsGetter,
} from './with-user-ssr'
import withUserSSR from './with-user-ssr'

type NormalizedDestination = {
  finalPathAndQuery: string
  finalFullUrl: string | null
}
type QueryParamValue = string | string[] | undefined

type RedirectToDestinationWhileAuthed = () => <
  P extends Dictionary = Dictionary,
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(
  propGetter?: SSRPropsGetter<P, Q, D>
) => GetServerSideProps<P, Q, D>

function createUrlSearchParamsFromQuery(
  query: Record<string, QueryParamValue>
): URLSearchParams {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    params.set(key, String(value))
  })

  return params
}

/**
 * Normalizes the destination from query parameters to be a path on the current domain,
 * merging other original query parameters.
 */
function normalizeDestination(
  currentQuery: ParsedUrlQuery,
  reqHeaders: IncomingHttpHeaders
): NormalizedDestination {
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
  const originalRequestParams = createUrlSearchParamsFromQuery(currentQuery)
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
 * should be used on SSR page which redirects user to `destination` route if authed
 */
const redirectToDestinationWhileAuthed: RedirectToDestinationWhileAuthed =
  () =>
  <
    P extends Dictionary = Dictionary,
    Q extends ParsedUrlQuery = ParsedUrlQuery,
    D extends PreviewData = PreviewData,
  >(
    getServerSidePropsFunc?: SSRPropsGetter<P, Q, D>
  ) =>
    withUserSSR()(async (ctx: SSRPropsContext<Q, D>) => {
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
        const intermediateRedirectParams = createUrlSearchParamsFromQuery(query)
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
        } as SSRPropsContext<Q, D>

        let props = {} as P
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
export type { NormalizedDestination, RedirectToDestinationWhileAuthed }
