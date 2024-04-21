import { SESSION_COOKIE_NAME } from '../config/index.mjs'
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
 * @typedef {(context: SSRPropsContext<Q, D>) => Promise<GetSSRResult<P>>} SSRPropsGetter
 */

/**
 * @template  {Dictionary} [P=Dictionary]
 * @template  {ParsedUrlQuery} [Q=ParsedUrlQuery]
 * @template  {PreviewData} [D=PreviewData]
 * @typedef {() => (propGetter?: SSRPropsGetter<P, Q, D>) => import('next').GetServerSideProps<P, Q, D>} RedirectToLoginWhileUnauthed
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
    const { req, query } = ctx
    const sessionCookie = req.cookies[SESSION_COOKIE_NAME] ?? ''

    try {
      await getAdminAuth().verifySessionCookie(sessionCookie)

      /**
       * user with valid session cookie
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
       * user without valid session cookie or other errors
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
        new URL(req.url, 'https://www.google.com').pathname
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
