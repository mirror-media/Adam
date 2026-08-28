import { z } from 'zod'

import {
  URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION,
  URL_STATIC_POPULAR_NEWS,
} from '@/config/index.mjs'
import { fetchStaticJsonByUrl } from '@/utils/api'
import { logZodMonitorFailure, monitorZodSafeParse } from '@/utils/zod-monitor'

import type { AsideArticle } from './aside-types'

const asideArticleSchema: z.ZodType<AsideArticle> = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string(),
  // TODO: 這邊是因為 latest json 沒有給 publishDate，所以先設 optional
  publishedDate: z.string().optional(),
  style: z.string().optional(),
  heroImage: z
    .object({
      resized: z.record(z.string()).nullish(),
      resizedWebp: z.record(z.string()).nullish(),
    })
    .nullish(),
})

const asideArticleListInputSchema = z.array(z.unknown())

/**
 * A broken post drops that post rather than the whole block, since the two
 * files are the only source the aside has.
 */
function toAsideArticles(input: unknown, boundary: string): AsideArticle[] {
  const listResult = monitorZodSafeParse(asideArticleListInputSchema, input, {
    boundary,
    schemaName: 'asideArticleListInputSchema',
  })

  if (!listResult.success) {
    return []
  }

  const articles: AsideArticle[] = []
  const invalidIssues: z.ZodIssue[] = []
  let invalidItemCount = 0

  listResult.data.forEach((item, index) => {
    const itemResult = asideArticleSchema.safeParse(item)

    if (itemResult.success) {
      articles.push(itemResult.data)
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
      boundary,
      schemaName: 'asideArticleSchema',
      error: new z.ZodError(invalidIssues),
      debugPayload: {
        invalidItemCount,
        totalItemCount: listResult.data.length,
      },
    })
  }

  return articles
}

async function fetchLatestArticlesInSection(
  sectionSlug: string
): Promise<AsideArticle[]> {
  try {
    const response = await fetchStaticJsonByUrl<unknown>(
      // A category with no section falls back to the news file, as the story page does.
      `${URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION}/section_${sectionSlug || 'news'}.json`
    )

    return toAsideArticles(
      // This file wraps its posts, the popular one does not.
      (response.data as { posts?: unknown })?.posts,
      'gcs-static-json:latest_news_in_certain_section'
    )
  } catch (error) {
    console.error(error)
    return []
  }
}

async function fetchPopularArticles(): Promise<AsideArticle[]> {
  try {
    const response = await fetchStaticJsonByUrl<unknown>(
      URL_STATIC_POPULAR_NEWS
    )

    return toAsideArticles(response.data, 'gcs-static-json:popular')
  } catch (error) {
    console.error(error)
    return []
  }
}

export { fetchLatestArticlesInSection, fetchPopularArticles }
