// GetServerSideProps-only: pulls in `utils/server-side-only/fetch-static-json`
// (Node `fs`), so only import this from the page's GSSP, never from
// client-rendered code — see `related-stories-client.ts` for that.
import client, { getStoryClient } from '@/apollo/apollo-client'
import {
  fetchExternalBySlug,
  fetchStoryExternalBySlug,
} from '@/apollo/query/externals'
import {
  API_TIMEOUT,
  STORY_GQL_ENDPOINT,
  URL_STATIC_POST_FLASH_NEWS,
} from '@/config/index.mjs'
import type { HeadersData, Topics } from '@/utils/api'
import { fetchHeaderDataInDefaultPageLayout } from '@/utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '@/utils/data-process'
import { processSettledResult } from '@/utils/response-processor'

import type { ExternalFlashNewsData, ExternalPost } from './external-types'

function getExternalPostBySlug(slug: string) {
  const storyClient = getStoryClient(STORY_GQL_ENDPOINT)
  if (storyClient) {
    return storyClient.query({
      query: fetchStoryExternalBySlug,
      variables: { slug },
    })
  }
  return client.query({ query: fetchExternalBySlug, variables: { slug } })
}

export async function fetchExternalPost(
  slug: string,
  logFields: Record<string, unknown>
): Promise<ExternalPost | null> {
  const [result] = await Promise.allSettled([getExternalPostBySlug(slug)])

  return processSettledResult(
    result,
    (queryResult) => {
      const [firstExternal] = queryResult?.data?.externals ?? []
      return firstExternal ?? null
    },
    `Error occurs while getting data in external post page (slug: ${slug})`,
    logFields
  )
}

async function fetchExternalFlashNewsData(): Promise<{
  data: { posts?: ExternalFlashNewsData }
} | null> {
  try {
    const mod = await import('@/utils/server-side-only/fetch-static-json')
    return await mod.fetchStaticJsonOnServer<{
      posts: ExternalFlashNewsData
    }>(URL_STATIC_POST_FLASH_NEWS, API_TIMEOUT)
  } catch {
    return null
  }
}

export async function fetchExternalHeaderAndFlashNewsData(
  slug: string,
  logFields: Record<string, unknown>
) {
  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchExternalFlashNewsData(),
  ])

  const [sectionsData, topicsData] = processSettledResult<
    Awaited<ReturnType<typeof fetchHeaderDataInDefaultPageLayout>>,
    [HeadersData, Topics]
  >(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    `Error occurs while getting header data in external post page (slug: ${slug})`,
    logFields
  )

  const flashNewsData = processSettledResult(
    responses[1],
    (data) => data?.data?.posts ?? [],
    'Error occurs while getting flash news in external page',
    logFields
  )

  return { sectionsData, topicsData, flashNewsData }
}
