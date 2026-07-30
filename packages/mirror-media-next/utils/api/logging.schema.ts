import { z } from 'zod'

import { monitorZodSafeParse } from '../zod-monitor'

const loggingRequestBodySchema = z
  .object({
    clientInfo: z.record(z.unknown()),
  })
  .passthrough()

type LoggingEndpoint = 'tracking' | 'error-report'

export function monitorLoggingRequestBody(
  endpoint: LoggingEndpoint,
  body: unknown
): void {
  monitorZodSafeParse(loggingRequestBodySchema, body, {
    boundary: `api:${endpoint}`,
    schemaName: 'loggingRequestBodySchema',
  })
}
