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
 * @callback RedirectToLoginWhileUnauthed
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
      const { query, resolvedUrl, user } = ctx

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
        const destination = getLoginUrl(resolvedUrl, query)

        return {
          redirect: {
            statusCode: 307,
            destination,
          },
        }
      }
    })

export default redirectToLoginWhileUnauthed
