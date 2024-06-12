import { getAdminAuth } from '../../firebase/admin'

/**
 * @typedef {import('querystring').ParsedUrlQuery} ParsedUrlQuery
 * @typedef {import('next').Redirect} Redirect
 * @typedef {import('next').PreviewData} PreviewData
 * @typedef {import('firebase-admin/auth').DecodedIdToken} DecodedIdToken
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
 * @typedef {import('next').GetServerSidePropsContext<Q, D> & { user?: DecodedIdToken}} SSRPropsContext
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
 * @callback WithUserSSR
 * @returns {
    <P extends Dictionary=Dictionary,
     Q extends ParsedUrlQuery=ParsedUrlQuery,
     D extends PreviewData=PreviewData>
    (propGetter?: SSRPropsGetter<P, Q, D>)
     => import('next').GetServerSideProps<P, Q, D>
   }
 */

/**
 * should be used on SSR page which requires firebase user data
 *
 * @type {WithUserSSR}
 */
const withUserSSR =
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
    const { req } = ctx
    const authToken = req.headers.authorization?.split(' ')[1]

    /** @type {DecodedIdToken | undefined} */
    let user
    try {
      user = await getAdminAuth().verifyIdToken(authToken, true)
    } catch (err) {
      if (!('codePrefix' in err) || err.codePrefix !== 'auth') {
        // error which is not FirebaseAuthError
        console.error(
          JSON.stringify({
            severity: 'ERROR',
            message: err.message,
          })
        )
      }
    }

    let props = /** @type {P | Promise<P>} */ ({})
    if (getServerSidePropsFunc) {
      ctx.user = user
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

export default withUserSSR
