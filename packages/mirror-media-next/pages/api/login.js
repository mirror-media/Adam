import Cors from 'cors'
import { SESSION_COOKIE_NAME } from '../../config/index.mjs'
import { runMiddleware } from '../../utils/api-route'
import { getAdminAuth } from '../../firebase/admin'
import cookie from 'cookie'

const VALID_AUTH_PERIOD = 60 * 5 // in second
const SESSION_LIFETIME = 1000 * 60 * 60 * 24 * 1 // in millisecond

const cors = Cors({
  methods: ['POST'],
})

/**
 * generate session cookie for the provided ID token
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .setHeader('Allow', 'HEAD, POST')
      .json({ error: 'Method Not Allowed' })
  }

  try {
    await runMiddleware(req, res, cors)

    const idToken = req.body.idToken?.toString()
    if (typeof idToken !== 'string') throw new Error('idToken in required')

    const auth = getAdminAuth()
    const decodedClaims = await auth.verifyIdToken(idToken, true)

    if (
      new Date().getTime() / 1000 - decodedClaims.auth_time >
      VALID_AUTH_PERIOD
    ) {
      // A user that was not recently signed in is trying to set a session cookie.
      // To guard against ID token theft, require re-authentication.
      return res.status(401).json({ error: 'Recent sign in required' })
    }

    const seesionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_LIFETIME,
    })

    return res
      .status(200)
      .setHeader(
        'Set-Cookie',
        cookie.serialize(SESSION_COOKIE_NAME, seesionCookie, {
          maxAge: SESSION_LIFETIME,
          httpOnly: true,
          secure: false,
          path: '/',
        })
      )
      .json({
        status: 'success',
      })
  } catch (err) {
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: err.message,
      })
    )

    return res.status(500).json({
      error: err.message,
    })
  }
}
