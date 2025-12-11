import withUserSSR from './with-user-ssr'
import { getLoginUrl } from './index'

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
 * @typedef {Object} RedirectOptions
 * @property {boolean} [skipRedirect=false] - If true, unauthenticated users will not be redirected to login.
 *                                            Useful for temporary access exceptions (e.g., special campaigns or
 *                                            non-premium access periods).
 */

/**
 * @callback RedirectToLoginWhileUnauthed
 * @param {RedirectOptions} [options] - Options to control redirect behavior.
 * @returns {
    <P extends Dictionary=Dictionary,
     Q extends ParsedUrlQuery=ParsedUrlQuery,
     D extends PreviewData=PreviewData>
    (propGetter?: SSRPropsGetter<P, Q, D>)
     => import('next').GetServerSideProps<P, Q, D>
   }
 */

/**
 * should be used on SSR page which redirects user to `login` if not authed
 *
 * @type {RedirectToLoginWhileUnauthed}
 */
const redirectToLoginWhileUnauthed =
  (options = {}) =>
  /**
   * @template {Dictionary} P
   * @template {ParsedUrlQuery} Q
   * @template {PreviewData} D
   */
  (
    /** @type {import('next').GetServerSideProps<P, Q, D>} */ getServerSidePropsFunc
  ) =>
    withUserSSR()(async (/** @type {SSRPropsContext<Q, D>} */ ctx) => {
      const { resolvedUrl, user } = ctx

      if (user) {
        let props = /** @type {P} */ ({})
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
            return /** @type {Promise<GetSSRResult<P>>} */ (
              getServerSidePropsFunc(ctx)
            )
          }

          return { props: /** @type {P} */ ({}) }
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
