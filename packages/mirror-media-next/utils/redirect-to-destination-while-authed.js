import { SESSION_COOKIE_NAME } from '../config/index.mjs'
import { getAdminAuth } from '../firebase/admin'
import { URLSearchParams } from 'node:url'

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
  async (/** @type {SSRPropsContext<Q, D>} */ ctx) => {
    const { req, query } = ctx
    const sessionCookie = req.cookies[SESSION_COOKIE_NAME] ?? ''

    try {
      await getAdminAuth().verifySessionCookie(sessionCookie)

      /**
       * user with valid session cookie
       */
      /** @type {string} */
      let destination = '/section/member'

      if ('destination' in query) {
        const dest = query.destination
        destination = Array.isArray(dest) ? dest.join(',') : dest
      }

      const searchParamsObject = new URLSearchParams(query)
      searchParamsObject.delete('destination')
      const searchParams = searchParamsObject.toString()

      if (searchParams) {
        destination = `${destination}?${searchParams}`
      }

      return {
        redirect: {
          statusCode: 307,
          destination,
        },
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
    }
  }

export default redirectToDestinationWhileAuthed
