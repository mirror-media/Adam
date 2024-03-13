import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import Cors from 'cors'

/**
 * @typedef {import("next").NextApiRequest} NextApiRequest
 * @typedef {import("next").NextApiResponse} NextApiResponse
 *
 * @typedef {Object} ErrorWithStatus
 * @property {string} message - error message
 * @property {number} status - http status
 *
 * @typedef {Object} GooglSheetParam
 * @property {string} id - google sheet id
 * @property {string} title - google sheet title
 * @property {Object} row - google sheet row, different structure on different sheet
 */

/**
 *
 * @param {string} message - error message
 * @param {number} status - http status
 * @returns {ErrorWithStatus}
 */
function errorWithStatus(message, status) {
  const error = new Error(message)
  /** @type {ErrorWithStatus} */
  const customError = {
    message: error.message,
    status,
  }
  return customError
}

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST'],
})

/**
 * @param {GooglSheetParam} googleSheet
 * @throws {ErrorWithStatus}
 */
async function addRowToGoogleSheet(googleSheet) {
  try {
    if (!googleSheet) {
      throw new Error('without google sheet param')
    }
    const { id, title, row } = googleSheet
    if (!id) {
      throw new Error('without google sheet id')
    }
    if (!title) {
      throw new Error('without google sheet title')
    }
    if (!row) {
      throw new Error('without new row data')
    }

    const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY
    const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL

    const serviceAccountAuth = new JWT({
      email: GOOGLE_SHEETS_CLIENT_EMAIL,
      key: GOOGLE_SHEETS_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const doc = new GoogleSpreadsheet(id, serviceAccountAuth)

    await doc.loadInfo()

    const sheet = doc.sheetsByTitle[title]

    await sheet.addRow(row)
  } catch (e) {
    if (e.message.startsWith('without')) {
      throw errorWithStatus(e.message, 400)
    }
    throw errorWithStatus(e.message, 500)
  }
}

/**
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 * @param {Function} fn
 */
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, async (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      try {
        const { googleSheet } = req.body
        await addRowToGoogleSheet(googleSheet)
      } catch (e) {
        reject(e)
      }

      return resolve(result)
    })
  })
}

/**
 * google sheet api to add row to specific google spreadsheet
 * To balance security and experience of development, allow cors in dev and local environment.
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
  try {
    const { googleSheet } = req.body

    if (
      process.env.NEXT_PUBLIC_ENV === 'dev' ||
      process.env.NEXT_PUBLIC_ENV === 'local'
    ) {
      // only dev and local env support CORS
      await runMiddleware(req, res, cors)
    } else {
      await addRowToGoogleSheet(googleSheet)
    }

    console.log(
      JSON.stringify({
        severity: 'INFO',
        message:
          '[INFO] Adding row to google sheet successed: ' +
          JSON.stringify(googleSheet),
      })
    )
    res.send({
      status: 'success',
    })
  } catch (e) {
    const wrappedMessage =
      '[ERROR] Adding row to google sheet failed: ' + e.message
    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: wrappedMessage,
      })
    )
    if (e.status) {
      res.status(e.status).send({
        error: wrappedMessage,
      })
    } else {
      res.status(500).send({
        error: wrappedMessage,
      })
    }
  }
}
