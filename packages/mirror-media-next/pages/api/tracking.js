import { Logging } from '@google-cloud/logging'
import requestIp from 'request-ip'
/**
 * @typedef {import('next').NextApiRequest} Req
 * @typedef {import('next').NextApiResponse} Res
 */

import {
  GCP_PROJECT_ID,
  GCP_STACKDRIVER_LOG_NAME,
  GCP_LOGGING_FEATURE_TOGGLE,
} from '../../config/index.mjs'

const loggingClient = new Logging({
  projectId: GCP_PROJECT_ID,
})

/**
 *
 * @param {Req} req
 * @param {Res} res
 */
export default function handler(req, res) {
  try {
    res.send({ msg: 'Received.' })
    const query = req.body
    const logName = getDefaultLogName()
    const log = loggingClient.log(logName)
    const metadata = { resource: { type: 'global' } }
    const clientIp = requestIp.getClientIp(req)

    query.clientInfo.ip = clientIp

    if (GCP_LOGGING_FEATURE_TOGGLE === 'on') {
      const entry = log.entry(metadata, query)
      log.write(entry)
    }
  } catch (error) {
    console.error(`[ERROR] Client info logging error occurred: ${error}.`)
  }
}

function getDefaultLogName() {
  return GCP_STACKDRIVER_LOG_NAME
}
