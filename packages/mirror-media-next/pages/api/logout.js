import Cors from 'cors'
import { SESSION_COOKIE_NAME } from '../../config/index.mjs'
import { runMiddleware } from '../../utils/api-route'
import cookie from 'cookie'
import { getAdminAuth } from '../../firebase/admin'

const cors = Cors({
  methods: ['POST'],
})

/**
 * remove session cookie
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

  /** @type {string} */
  let sessionCookie

  try {
    await runMiddleware(req, res, cors)

    sessionCookie = req.cookies[SESSION_COOKIE_NAME]
    if (sessionCookie) {
      const decodedClaims = await getAdminAuth().verifySessionCookie(
        sessionCookie
      )
      await getAdminAuth().revokeRefreshTokens(decodedClaims.sub)
    }

    return res
      .status(200)
      .setHeader(
        'Set-Cookie',
        cookie.serialize(SESSION_COOKIE_NAME, '', {
          expires: new Date(0), // set time in the past to remove cookie
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
        debugPayload: {
          sessionCookie,
        },
      })
    )

    return res.status(500).json({
      error: err.message,
    })
  }
}
