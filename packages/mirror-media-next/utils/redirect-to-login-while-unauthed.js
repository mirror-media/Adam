import { getAdminAuth } from '../firebase/admin'
import { URL, URLSearchParams } from 'node:url'

/**
 * @typedef {import('querystring').ParsedUrlQuery} ParsedUrlQuery
 * @typedef {import('next').Redirect} Redirect
 * @typedef {import('next').PreviewData} PreviewData
 */

/**
 * @template [T=any]
 * @typedef {Record<string, T>} Dictionary
 */

/**
 * @template P
 * @typedef {P} GetSSRProps
 */

/**
 * @template P
 * @typedef {{ redirect: Redirect } | { notFound: true } | { props: GetSSRProps<P> }} GetSSRResult
 */

/**
 * @template {ParsedUrlQuery} [Q=ParsedUrlQuery]
 * @template {PreviewData} [D=PreviewData]
 * @typedef {import('next').GetServerSidePropsContext<Q, D>} SSRPropsContext
 */

/**
 * @template P
 * @template {ParsedUrlQuery} Q
 * @template {PreviewData} D
 * @callback SSRPropsGetter
 * @param {SSRPropsContext<Q, D>} context
 * @returns {Promise<GetSSRResult<P>>}
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
  async (/** @type {SSRPropsContext<Q, D>} */ ctx) => {
    const { req, query, resolvedUrl } = ctx
    const authToken = req.headers.authorization?.split(' ')[1]

    try {
      await getAdminAuth().verifyIdToken(authToken, true)

      /**
       * user with valid id token
       */
      let props = /** @type {P | Promise<P>} */ ({})
      if (getServerSidePropsFunc) {
        const composedProps = await getServerSidePropsFunc(ctx)

        if (composedProps) {
          if ('props' in composedProps) {
            props = composedProps.props

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
    } catch (err) {
      /**
       * user without valid id token or other errors
       */

      if (!('codePrefix' in err) || err.codePrefix !== 'auth') {
        // error which is not FirebaseAuthError
        console.error(
          JSON.stringify({
            severity: 'ERROR',
            message: err.message,
          })
        )
      }

      const searchParamsObject = new URLSearchParams(query)
      searchParamsObject.set(
        'destination',
        new URL(resolvedUrl, 'https://www.google.com').pathname
      )
      const searchParams = searchParamsObject.toString()
      const destination = `/login?${searchParams}`

      return {
        redirect: {
          statusCode: 307,
          destination,
        },
      }
    }
  }

export default redirectToLoginWhileUnauthed
