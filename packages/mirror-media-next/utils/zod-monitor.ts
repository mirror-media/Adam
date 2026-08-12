import type { z } from 'zod'

type MonitorZodFailureInput = {
  boundary: string
  schemaName: string
  error: z.ZodError
  debugPayload?: Record<string, unknown>
}

const LOG_INTERVAL_MS = 60_000
const lastLoggedAtBySchema = new Map<string, number>()

const formatPath = (path: (string | number)[]): string => {
  return path.length ? path.map(String).join('.') : '(root)'
}

const shouldLog = (key: string, now: number): boolean => {
  const lastLoggedAt = lastLoggedAtBySchema.get(key)

  if (lastLoggedAt !== undefined && now - lastLoggedAt < LOG_INTERVAL_MS) {
    return false
  }

  lastLoggedAtBySchema.set(key, now)
  return true
}

export function logZodMonitorFailure({
  boundary,
  schemaName,
  error,
  debugPayload,
}: MonitorZodFailureInput): void {
  const now = Date.now()
  const key = `${boundary}:${schemaName}`

  if (!shouldLog(key, now)) {
    return
  }

  console.warn(
    JSON.stringify({
      severity: 'WARNING',
      message: '[zod-monitor] schema validation failed',
      boundary,
      schemaName,
      issues: error.issues.map((issue) => ({
        path: formatPath(issue.path),
        code: issue.code,
      })),
      ...(debugPayload ? { debugPayload } : {}),
    })
  )
}

export function monitorZodSafeParse<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  input: unknown,
  options: {
    boundary: string
    schemaName: string
  }
): z.SafeParseReturnType<unknown, z.infer<TSchema>> {
  const result = schema.safeParse(input)

  if (!result.success) {
    logZodMonitorFailure({
      boundary: options.boundary,
      schemaName: options.schemaName,
      error: result.error,
    })
  }

  return result
}
