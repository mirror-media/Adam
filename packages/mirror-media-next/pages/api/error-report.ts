import type { NextApiRequest, NextApiResponse } from 'next'
import { Logging } from '@google-cloud/logging'
import requestIp from 'request-ip'

import {
  GCP_PROJECT_ID,
  GCP_STACKDRIVER_ERROR_LOG_NAME,
} from '../../config/index.mjs'

const loggingClient = new Logging({
  projectId: GCP_PROJECT_ID,
})

/**
 * This API is for client-side error report only
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.send({ msg: 'Received.' })
    const query = req.body
    const log = loggingClient.log(GCP_STACKDRIVER_ERROR_LOG_NAME)
    const metadata = { resource: { type: 'global' } }
    const clientIp = requestIp.getClientIp(req)

    query.clientInfo.ip = clientIp

    const entry = log.entry(metadata, query)
    log.write(entry)
  } catch (error) {
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: 'encouter errored while writing error log',
        debugPayload: {
          error,
          log: req.body,
        },
      })
    )
  }
}
