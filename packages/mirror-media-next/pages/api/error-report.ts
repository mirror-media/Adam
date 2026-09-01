import type { NextApiRequest, NextApiResponse } from 'next'
import { Logging } from '@google-cloud/logging'
import requestIp from 'request-ip'

import {
  ENV,
  GCP_PROJECT_ID,
  GCP_STACKDRIVER_ERROR_LOG_NAME,
} from '../../config/index.mjs'
import { monitorLoggingRequestBody } from '../../utils/api/logging.schema'

const loggingClient =
  ENV === 'local'
    ? null
    : new Logging({
        projectId: GCP_PROJECT_ID,
      })

/**
 * This API is for client-side error report only
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    res.send({ msg: 'Received.' })
    monitorLoggingRequestBody('error-report', req.body)

    if (!loggingClient) {
      return
    }

    const query = req.body
    const log = loggingClient.log(GCP_STACKDRIVER_ERROR_LOG_NAME)
    // Error Reporting only picks up entries logged at ERROR or above.
    const metadata = { resource: { type: 'global' }, severity: 'ERROR' }
    const clientIp = requestIp.getClientIp(req)

    query.clientInfo.ip = clientIp

    const entry = log.entry(metadata, query)
    await log.write(entry)
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
