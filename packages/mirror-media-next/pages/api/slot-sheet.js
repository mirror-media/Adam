import { google } from 'googleapis'

import {
  GOOGLE_SHEETS_PRIVATE_KEY,
  GOOGLE_SHEETS_CLIENT_ID,
  GOOGLE_SHEETS_CLIENT_EMAIL,
  GOOGLE_SHEET_SLOT_ID,
} from '../../config/index.mjs'

function getHasPlayed(sheetData, userFirebaseId) {
  const today = new Date().toLocaleDateString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  for (const item of sheetData) {
    // eslint-disable-next-line
    const [dateString, _, firebaseId] = item
    if (dateString.startsWith(today) && userFirebaseId === firebaseId) {
      return true
    }
  }

  return false
}

function calculateWinningProbabilities(inputArray) {
  // eslint-disable-next-line
  const [_, __, ___, total100, total50, ____, _____, prob100, prob50] =
    inputArray

  const total100Participants = parseInt(total100)
  const total50Participants = parseInt(total50)

  const probabilities = {}

  // 100 元機率
  if (total100Participants < 100) {
    probabilities.prize100 = parseFloat(prob100)
  } else {
    probabilities.prize100 = 0
  }

  // 50元獎項機率
  if (total50Participants < 200) {
    probabilities.prize50 = parseFloat(prob50)
  } else {
    probabilities.prize50 = 0
  }

  return probabilities
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain')
  const { userEmail, dispatch, prize, userFirebaseId } = req.body
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_SHEETS_CLIENT_EMAIL,
      client_id: GOOGLE_SHEETS_CLIENT_ID,
      private_key: GOOGLE_SHEETS_PRIVATE_KEY,
    },
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  })
  const sheets = google.sheets({
    auth,
    version: 'v4',
  })

  if (dispatch === 'WRITE_NEW_LINE') {
    try {
      const now = new Date().toLocaleDateString('zh-TW', {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })

      const dataToAppend = [
        [
          now,
          userEmail,
          userFirebaseId,
          prize === '100' ? '1' : '0',
          prize === '50' ? '1' : '0',
          prize === '0' ? '1' : '0',
        ],
      ]

      const appendParams = {
        spreadsheetId: GOOGLE_SHEET_SLOT_ID,
        range: '遊戲名單!A2:F2',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: dataToAppend,
        },
      }

      await sheets.spreadsheets.values.append(appendParams)
      res.send({
        status: 'success',
      })
    } catch (err) {
      console.log(err)
      res.send({
        status: 'fail',
        error: err,
      })
      res.end()
    }
  } else {
    try {
      const {
        data: { values },
      } = await sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEET_SLOT_ID,
        range: '遊戲名單!A2:I',
      })
      if (!values) {
        throw new Error('cannot fetch google sheets')
      }
      // 判斷使用者今日是否玩過
      const hasPlayed = getHasPlayed(values, userFirebaseId)
      if (hasPlayed) {
        res.send({
          status: 'success',
          data: { hasPlayed: true, probabilities: { prize100: 0, prize50: 0 } },
        })
        res.end()
        return
      }

      // 判斷中獎機率
      const probabilities = calculateWinningProbabilities(values[0])
      res.send({
        status: 'success',
        data: { hasPlayed: false, probabilities },
      })
      res.end()
    } catch (err) {
      console.log(err)
      res.send({
        status: 'fail',
        error: err,
      })
      res.end()
    }
  }
}
