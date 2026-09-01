import { z } from 'zod'

import type { FetchCategorySectionsQuery } from '@/apollo/__generated__/content/graphql'
import type { ListingPost } from '@/apollo/fragments/post'
import {
  URL_STATIC_NEWS_CATEGORY_INFO,
  URL_STATIC_NEWS_CATEGORY_POSTS,
} from '@/config/index.mjs'
import { fetchStaticJsonByUrl } from '@/utils/api'
import { monitorZodSafeParse } from '@/utils/zod-monitor'

import type { CategorySummary } from './category-types'

/**
 * The static JSON is a dump of the GraphQL category query, so the schema mirrors
 * that shape exactly — every field but `id` nullable — and its result feeds the
 * same `toCategorySummary` the GraphQL path uses.
 */
const newsCategorySectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().nullable(),
  slug: z.string().nullable(),
  state: z.string().nullable(),
})

const newsCategoryInfoSchema = z.object({
  category: z.object({
    id: z.string().min(1),
    isMemberOnly: z.boolean().nullable(),
    name: z.string().nullable(),
    sections: z.array(newsCategorySectionSchema).nullable(),
    slug: z.string().nullable(),
    state: z.string().nullable(),
  }),
})

/**
 * The query returns every field as nullable and selects no nested categories,
 * so the shape the page renders is built here. `state` stays for
 * the route's 404 rule reads it directly.
 */
function toCategorySummary(
  category: FetchCategorySectionsQuery['category']
): CategorySummary | null {
  if (!category) {
    return null
  }

  return {
    id: category.id,
    isMemberOnly: category.isMemberOnly ?? false,
    name: category.name ?? '',
    sections: (category.sections ?? []).map((section) => ({
      id: section.id,
      name: section.name ?? '',
      slug: section.slug ?? '',
    })),
    slug: category.slug ?? '',
    state: category.state,
  }
}

async function fetchNewsCategoryInfo(): Promise<CategorySummary | null> {
  const response = await fetchStaticJsonByUrl<unknown>(
    URL_STATIC_NEWS_CATEGORY_INFO
  )

  const result = monitorZodSafeParse(newsCategoryInfoSchema, response.data, {
    boundary: 'gcs-static-json:category_news',
    schemaName: 'newsCategoryInfoSchema',
  })

  if (!result.success) {
    return null
  }

  return toCategorySummary(result.data.category)
}

/**
 * One JSON file holds 120 posts and the generator writes at most four of them,
 * so a page beyond the fourth file has nothing to read.
 */
const POSTS_PER_JSON = 120
const LAST_JSON_FILE_ORDER = 4

/**
 * A post has a large structure and the listing only reads part of it, so the
 * schema covers everything except `items`.
 */
const newsCategoryPostsSchema = z.object({
  posts: z.object({
    items: z.array(z.unknown()),
    counts: z.object({
      posts: z.number().nonnegative(),
      externals: z.number().nonnegative(),
    }),
  }),
})

/**
 * Reads one page out of the pre-generated JSON files. Failures resolve to an
 * empty list: server side that becomes a 404, and the infinite scroll on the
 * client stops asking for more.
 */
async function fetchNewsCategoryPostsJSON(
  page = 1,
  take = 24
): Promise<{ items: ListingPost[]; counts: number }> {
  const takePerJson = POSTS_PER_JSON / take
  const jsonFileOrder = Math.ceil(page / takePerJson)
  const jsonUrl = `${URL_STATIC_NEWS_CATEGORY_POSTS}_${jsonFileOrder}.json`

  try {
    const response = await fetchStaticJsonByUrl<unknown>(jsonUrl)

    const result = monitorZodSafeParse(newsCategoryPostsSchema, response.data, {
      boundary: 'gcs-static-json:latest_content_category_news',
      schemaName: 'newsCategoryPostsSchema',
    })

    if (!result.success) {
      return { items: [], counts: 0 }
    }

    const startIndex = ((page - 1) % takePerJson) * take
    const pageItems = result.data.posts.items.slice(
      startIndex,
      startIndex + take
    )

    return {
      // The posts are not validated, so what the page renders is asserted here.
      items:
        jsonFileOrder <= LAST_JSON_FILE_ORDER
          ? // TODO: ListingPost 與目前 json 回傳的格式不完全相容，但在顯示上沒有問題，後續要找時間處理
            (pageItems as ListingPost[])
          : [],
      counts:
        result.data.posts.counts.posts + result.data.posts.counts.externals,
    }
  } catch (err) {
    console.error(
      'Failed to fetch JSON of URL_STATIC_NEWS_CATEGORY_POSTS: ',
      JSON.stringify(err)
    )
    return { items: [], counts: 0 }
  }
}

export { fetchNewsCategoryInfo, fetchNewsCategoryPostsJSON, toCategorySummary }
