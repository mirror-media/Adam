import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from 'next'
import type { DecodedIdToken } from 'firebase-admin/auth'
import type { ParsedUrlQuery } from 'querystring'

import { getAdminAuth } from '../../firebase/admin'

type Dictionary<T = unknown> = Record<string, T>
type GetSSRProps<P> = P
type GetSSRResult<P> = GetServerSidePropsResult<GetSSRProps<P>>
type SSRPropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
> = GetServerSidePropsContext<Q, D> & { user?: DecodedIdToken }
type SSRPropsGetter<
  P extends Dictionary = Dictionary,
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
> = (context: SSRPropsContext<Q, D>) => Promise<GetSSRResult<P>>
type WithUserSSR = () => <
  P extends Dictionary = Dictionary,
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData,
>(
  propGetter?: SSRPropsGetter<P, Q, D>
) => GetServerSideProps<P, Q, D>

/**
 * should be used on SSR page which requires firebase user data
 */
const withUserSSR: WithUserSSR =
  () =>
  <
    P extends Dictionary = Dictionary,
    Q extends ParsedUrlQuery = ParsedUrlQuery,
    D extends PreviewData = PreviewData,
  >(
    getServerSidePropsFunc?: SSRPropsGetter<P, Q, D>
  ) =>
  async (ctx: SSRPropsContext<Q, D>) => {
    const { req } = ctx
    const authToken = req.headers.authorization?.split(' ')[1]

    let user: DecodedIdToken | undefined
    try {
      user = await getAdminAuth().verifyIdToken(authToken as string, true)
    } catch (err) {
      if (
        !err ||
        typeof err !== 'object' ||
        !('codePrefix' in err) ||
        err.codePrefix !== 'auth'
      ) {
        // error which is not FirebaseAuthError
        console.error(
          JSON.stringify({
            severity: 'ERROR',
            message: err instanceof Error ? err.message : String(err),
          })
        )
      }
    }

    let props: P | Promise<P> = {} as P
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
export type {
  Dictionary,
  GetSSRProps,
  GetSSRResult,
  SSRPropsContext,
  SSRPropsGetter,
  WithUserSSR,
}
