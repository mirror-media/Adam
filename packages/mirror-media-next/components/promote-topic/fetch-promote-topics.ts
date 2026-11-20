import { z } from 'zod'

import { URL_STATIC_PROMOTE_TOPICS } from '@/config/index.mjs'
import { fetchStaticJsonByUrl } from '@/utils/api'
import { monitorZodSafeParse } from '@/utils/zod-monitor'

type PromoteTopicData = {
  id: string
  order: number | null
  slug: string
  name: string
  heroImage: {
    resized?: Record<string, string>
    resizedWebp?: Record<string, string>
  }
}

const imageSetSchema = z
  .record(z.string(), z.string())
  .transform((images) =>
    Object.values(images).some(Boolean) ? images : undefined
  )

const promoteTopicsSchema = z.object({
  promoteTopics: z.array(
    z.object({
      id: z.union([z.string(), z.number()]).transform(String),
      order: z.number().nullable().optional(),
      topics: z
        .object({
          slug: z.string().optional(),
          name: z.string().optional(),
          heroImage: z
            .object({
              resized: imageSetSchema.optional(),
              resizedWebp: imageSetSchema.optional(),
            })
            .nullable()
            .optional(),
        })
        .nullable()
        .optional(),
    })
  ),
})

type PromoteTopicsResponse = z.infer<typeof promoteTopicsSchema>
type PromoteTopicItem = PromoteTopicsResponse['promoteTopics'][number]

function normalizePromoteTopic(
  item: PromoteTopicItem
): PromoteTopicData | null {
  const topic = item.topics
  const heroImage = topic?.heroImage
  const resized = heroImage?.resized
  const resizedWebp = heroImage?.resizedWebp

  if (!topic?.slug || !topic.name || (!resized && !resizedWebp)) {
    return null
  }

  return {
    id: item.id,
    order: item.order ?? null,
    slug: topic.slug,
    name: topic.name,
    heroImage: {
      resized,
      resizedWebp,
    },
  }
}

function normalizePromoteTopics(
  promoteTopics: PromoteTopicItem[]
): PromoteTopicData[] {
  return promoteTopics.flatMap((item) => normalizePromoteTopic(item) ?? [])
}

async function fetchPromoteTopics(): Promise<PromoteTopicData[]> {
  try {
    const { data } = await fetchStaticJsonByUrl<unknown>(
      URL_STATIC_PROMOTE_TOPICS
    )
    const result = monitorZodSafeParse(promoteTopicsSchema, data, {
      boundary: 'promote-topic',
      schemaName: 'promoteTopicsSchema',
    })

    if (!result.success) return []

    return normalizePromoteTopics(result.data.promoteTopics).sort(
      (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)
    )
  } catch (error) {
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: 'Error occurs while fetching promote topics',
        error: error instanceof Error ? error.message : String(error),
      })
    )
    return []
  }
}

export { fetchPromoteTopics }
export type { PromoteTopicData }
