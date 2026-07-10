import type { z } from 'zod'

import {
  headersStaticJsonSchema,
  premiumSectionsStaticJsonSchema,
  topicsStaticJsonSchema,
} from '../api/header-static-json.schema'
import { monitorZodSafeParse } from '../zod-monitor'

type StaticJsonMonitorEntry = {
  fileName: string
  boundary: string
  schemaName: string
  schema: z.ZodTypeAny
}

const staticJsonMonitorEntries: StaticJsonMonitorEntry[] = [
  {
    fileName: 'header_headers.json',
    boundary: 'gcs-static-json:header_headers',
    schemaName: 'headersStaticJsonSchema',
    schema: headersStaticJsonSchema,
  },
  {
    fileName: 'header_member.json',
    boundary: 'gcs-static-json:header_member',
    schemaName: 'premiumSectionsStaticJsonSchema',
    schema: premiumSectionsStaticJsonSchema,
  },
  {
    fileName: 'header_topics.json',
    boundary: 'gcs-static-json:header_topics',
    schemaName: 'topicsStaticJsonSchema',
    schema: topicsStaticJsonSchema,
  },
]

const getStaticJsonFileName = (requestUrl: string): string | undefined => {
  try {
    const { pathname } = new URL(requestUrl)
    const pathSegments = pathname.split('/').filter(Boolean)
    return pathSegments[pathSegments.length - 1]
  } catch {
    return undefined
  }
}

const getStaticJsonMonitorEntry = (
  requestUrl: string
): StaticJsonMonitorEntry | undefined => {
  const fileName = getStaticJsonFileName(requestUrl)
  if (!fileName) {
    return undefined
  }

  return staticJsonMonitorEntries.find((entry) => entry.fileName === fileName)
}

export function monitorStaticJsonByUrl(
  requestUrl: string,
  data: unknown
): void {
  const entry = getStaticJsonMonitorEntry(requestUrl)

  if (!entry) {
    return
  }

  monitorZodSafeParse(entry.schema, data, {
    boundary: entry.boundary,
    schemaName: entry.schemaName,
  })
}
