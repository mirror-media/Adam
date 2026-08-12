import { z } from 'zod'

import { URL_STATIC_PODCAST_LIST } from '@/config/index.mjs'
import { fetchStaticJsonByUrl } from '@/utils/api'
import { logZodMonitorFailure, monitorZodSafeParse } from '@/utils/zod-monitor'

import type { Podcast, PodcastEnclosure } from './podcast-types'

const podcastEnclosureSchema: z.ZodType<PodcastEnclosure> = z.object({
  file_size: z.number().nonnegative(),
  mime_type: z.string().min(1),
  url: z.string().url(),
})

const podcastSchema: z.ZodType<Podcast> = z.object({
  author: z.string().min(1),
  description: z.string(),
  duration: z.string().min(1),
  enclosures: z.array(podcastEnclosureSchema).min(1),
  guid: z.string().min(1),
  heroImage: z.string().url(),
  link: z.string().url(),
  published: z.string().min(1),
  title: z.string().min(1),
})

const podcastListInputSchema = z.array(z.unknown())

function toPodcastListViewModel(input: unknown): Podcast[] | null {
  const listResult = monitorZodSafeParse(podcastListInputSchema, input, {
    boundary: 'gcs-static-json:podcast_list',
    schemaName: 'podcastListInputSchema',
  })

  if (!listResult.success) {
    return null
  }

  const podcasts: Podcast[] = []
  const invalidIssues: z.ZodIssue[] = []
  let invalidItemCount = 0

  listResult.data.forEach((item, index) => {
    const itemResult = podcastSchema.safeParse(item)

    if (itemResult.success) {
      podcasts.push(itemResult.data)
      return
    }

    invalidItemCount += 1
    invalidIssues.push(
      ...itemResult.error.issues.map((issue) => ({
        ...issue,
        path: [index, ...issue.path],
      }))
    )
  })

  if (invalidIssues.length > 0) {
    logZodMonitorFailure({
      boundary: 'gcs-static-json:podcast_list',
      schemaName: 'podcastSchema',
      error: new z.ZodError(invalidIssues),
      debugPayload: {
        invalidItemCount,
        totalItemCount: listResult.data.length,
      },
    })
  }

  return podcasts
}

async function fetchPodcastList(): Promise<Podcast[]> {
  const response = await fetchStaticJsonByUrl<unknown>(URL_STATIC_PODCAST_LIST)

  return toPodcastListViewModel(response.data) ?? []
}

export { fetchPodcastList }
