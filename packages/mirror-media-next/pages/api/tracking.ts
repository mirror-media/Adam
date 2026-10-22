import type { NextApiRequest, NextApiResponse } from 'next'
import { Logging } from '@google-cloud/logging'
import requestIp from 'request-ip'

import {
  ENV,
  GCP_PROJECT_ID,
  GCP_STACKDRIVER_LOG_NAME,
} from '../../config/index.mjs'
import { monitorLoggingRequestBody } from '../../utils/api/logging.schema'

const loggingClient =
  ENV === 'local'
    ? null
    : new Logging({
        projectId: GCP_PROJECT_ID,
      })

const ALLOWED_USER_BEHAVIOR_EVENT_TYPES = new Set(['pageview', 'exit', 'click'])

type UserBehaviorLogBody = {
  clientInfo: Record<string, unknown>
  triggerEvent: {
    'event-type': string
  }
}

function isAllowedUserBehaviorLog(body: unknown): body is UserBehaviorLogBody {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return false
  }

  const record = body as Record<string, unknown>
  const clientInfo = record.clientInfo
  const triggerEvent = record.triggerEvent

  if (
    !clientInfo ||
    typeof clientInfo !== 'object' ||
    Array.isArray(clientInfo) ||
    !triggerEvent ||
    typeof triggerEvent !== 'object' ||
    Array.isArray(triggerEvent)
  ) {
    return false
  }

  const eventType = (triggerEvent as Record<string, unknown>)['event-type']

  return (
    typeof eventType === 'string' &&
    ALLOWED_USER_BEHAVIOR_EVENT_TYPES.has(eventType)
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    res.send({ msg: 'Received.' })
    monitorLoggingRequestBody('tracking', req.body)

    const query = req.body

    if (!loggingClient || !isAllowedUserBehaviorLog(query)) {
      return
    }

    const log = loggingClient.log(GCP_STACKDRIVER_LOG_NAME)
    const metadata = { resource: { type: 'global' } }
    const clientIp = requestIp.getClientIp(req)

    query.clientInfo.ip = clientIp

    const entry = log.entry(metadata, query)
    await log.write(entry)
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
