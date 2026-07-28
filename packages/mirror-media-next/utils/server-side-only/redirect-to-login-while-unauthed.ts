import type { GetServerSideProps, PreviewData } from 'next'
import type { ParsedUrlQuery } from 'querystring'

import { getLoginUrl } from './index'
import type {
  Dictionary,
  GetSSRResult,
  SSRPropsContext,
  SSRPropsGetter,
} from './with-user-ssr'
import withUserSSR from './with-user-ssr'

type RedirectOptions = {
  /**
   * If true, unauthenticated users will not be redirected to login.
   * Useful for temporary access exceptions (e.g., special campaigns or
   * non-premium access periods).
   */
  skipRedirect?: boolean
}

type RedirectToLoginWhileUnauthed = (
  options?: RedirectOptions
) => <
  P extends Dictionary = Dictionary,
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(
  propGetter?: SSRPropsGetter<P, Q, D>
) => GetServerSideProps<P, Q, D>

/**
 * should be used on SSR page which redirects user to `login` if not authed
 */
const redirectToLoginWhileUnauthed: RedirectToLoginWhileUnauthed =
  (options = {}) =>
  <
    P extends Dictionary = Dictionary,
    Q extends ParsedUrlQuery = ParsedUrlQuery,
    D extends PreviewData = PreviewData,
  >(
    getServerSidePropsFunc?: SSRPropsGetter<P, Q, D>
  ) =>
    withUserSSR()(async (ctx: SSRPropsContext<Q, D>) => {
      const { resolvedUrl, user } = ctx

      if (user) {
        let props = {} as P
        if (getServerSidePropsFunc) {
          const composedProps = await getServerSidePropsFunc(ctx)

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
      } else {
        if (options.skipRedirect) {
          // Case: user is not logged in, but skipRedirect = true
          // → Still execute getServerSidePropsFunc so page can render data without auth
          if (getServerSidePropsFunc) {
            // directly return the Promise without await.
            // Because the outer function is already async, Next.js will handle it correctly.
            // Using await here is unnecessary, unless we need to inspect keys like "props" or "redirect".
            return getServerSidePropsFunc(ctx) as Promise<GetSSRResult<P>>
          }

          return { props: {} as P }
        }

        const destination = getLoginUrl(resolvedUrl)

        return {
          redirect: {
            statusCode: 307,
            destination,
          },
        }
      }
    })

export default redirectToLoginWhileUnauthed
export type { RedirectOptions, RedirectToLoginWhileUnauthed }
