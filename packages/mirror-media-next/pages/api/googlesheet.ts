import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'

import {
  GOOGLE_SHEETS_CLIENT_EMAIL,
  GOOGLE_SHEETS_PRIVATE_KEY,
} from '../../config/index.mjs'
import { runMiddleware } from '../../utils/api-route'

type ErrorWithStatus = {
  message: string
  status: number
}

type GoogleSheetParam = {
  id: string
  title: string
  row: Parameters<GoogleSpreadsheet['sheetsByTitle'][string]['addRow']>[0]
}

type GoogleSheetRequestBody = {
  googleSheet?: GoogleSheetParam
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }
  return String(error)
}

function isErrorWithStatus(error: unknown): error is ErrorWithStatus {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    'status' in error &&
    typeof error.status === 'number'
  )
}

function errorWithStatus(message: string, status: number): ErrorWithStatus {
  const error = new Error(message)
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

async function addRowToGoogleSheet(googleSheet?: GoogleSheetParam) {
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
    const message = getErrorMessage(e)
    if (message.startsWith('without')) {
      throw errorWithStatus(message, 400)
    }
    throw errorWithStatus(message, 500)
  }
}

/**
 * google sheet api to add row to specific google spreadsheet
 * To balance security and experience of development, allow cors in dev and local environment.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res
      .status(405)
      .setHeader('Allow', ['HEAD', 'POST'])
      .send({ error: 'Method Not Allowed' })
    return
  }

  try {
    const { googleSheet } = req.body as GoogleSheetRequestBody

    if (
      process.env.NEXT_PUBLIC_ENV === 'dev' ||
      process.env.NEXT_PUBLIC_ENV === 'local'
    ) {
      // only dev and local env support CORS
      await runMiddleware(req, res, cors)
    }
    await addRowToGoogleSheet(googleSheet)

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
    const message = getErrorMessage(e)
    const status = isErrorWithStatus(e) && e.status ? e.status : 500
    const wrappedMessage =
      '[ERROR] Adding row to google sheet failed: ' + message
    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: wrappedMessage,
      })
    )
    res.status(status).send({
      error: wrappedMessage,
    })
  }
}
