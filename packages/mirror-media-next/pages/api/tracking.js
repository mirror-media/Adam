import { Logging } from '@google-cloud/logging'
import requestIp from 'request-ip'
/**
 * @typedef {import('next').NextApiRequest} Req
 * @typedef {import('next').NextApiResponse} Res
 */

import {
  GCP_PROJECT_ID,
  GCP_STACKDRIVER_LOG_NAME,
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
    const log = loggingClient.log(GCP_STACKDRIVER_LOG_NAME)
    const metadata = { resource: { type: 'global' } }
    const clientIp = requestIp.getClientIp(req)

    query.clientInfo.ip = clientIp

    const entry = log.entry(metadata, query)
    log.write(entry)
  } catch (error) {
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: 'encouter errored while writing user behavior log',
        debugPayload: {
          error,
          log: req.body,
        },
      })
    )
  }
}
