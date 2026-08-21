// GetServerSideProps-only: pulls in `utils/server-side-only/fetch-static-json`
// (Node `fs`), so only import this from the page's GSSP, never from
// client-rendered code — see `related-stories-client.ts` for that.
import axios from 'axios'

import client, { getStoryClient } from '@/apollo/apollo-client'
import {
  fetchContentStoryPostBySlug,
  fetchStoryPostBySlug,
} from '@/apollo/query/posts'
import {
  API_TIMEOUT,
  IS_PREVIEW_MODE,
  STORY_GQL_ENDPOINT,
  URL_STATIC_POST_FLASH_NEWS,
} from '@/config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '@/utils/api'
import { logAxiosError } from '@/utils/log/shared'
import { processSettledResult } from '@/utils/response-processor'

import type {
  PostData,
  StoryFlashNewsData,
  StoryHeaderData,
  StoryLayoutType,
} from './story-types'

export function getStoryLayoutType(
  articleStyle: PostData['style']
): StoryLayoutType {
  if (articleStyle === 'wide') {
    return 'style-wide'
  } else if (articleStyle === 'photography') {
    return 'style-photography'
  }
  return 'style-normal'
}

export async function fetchStoryPost(slug: string): Promise<PostData | null> {
  const storyEndpointClient = IS_PREVIEW_MODE
    ? null
    : getStoryClient(STORY_GQL_ENDPOINT)
  const storyClient = storyEndpointClient || client

  const result = await storyClient.query({
    query: storyEndpointClient
      ? fetchStoryPostBySlug
      : fetchContentStoryPostBySlug,
    variables: { slug },
  })

  const postData = result?.data?.post

  if (!postData) {
    return null
  }

  // The GraphQL schema is the server-enforced contract (see README data
  // contracts), so we trust its shape here instead of re-validating it;
  // the generated query type is looser (nullable scalars) than the
  // story capability's view type, hence the `unknown` bridge.
  return postData as unknown as PostData
}

async function fetchStoryFlashNewsData(): Promise<{
  data: { posts?: StoryFlashNewsData }
}> {
  try {
    const mod = await import('@/utils/server-side-only/fetch-static-json')
    return await mod.fetchStaticJsonOnServer<{ posts: StoryFlashNewsData }>(
      URL_STATIC_POST_FLASH_NEWS,
      API_TIMEOUT
    )
  } catch {
    return axios<{ posts: StoryFlashNewsData }>({
      method: 'get',
      url: URL_STATIC_POST_FLASH_NEWS,
      timeout: API_TIMEOUT,
    })
  }
}

export async function fetchStoryHeaderAndFlashNewsData(
  slug: string,
  logFields: Record<string, unknown>
): Promise<{ headerData: StoryHeaderData; flashNewsData: StoryFlashNewsData }> {
  try {
    const responses = await Promise.allSettled([
      fetchStoryFlashNewsData(),
      fetchHeaderDataInDefaultPageLayout(),
    ])

    const flashNewsData = processSettledResult(
      responses[0],
      (response) => response?.data?.posts ?? [],
      'Error occurs while getting flash news in story page',
      logFields
    )

    const headerData = processSettledResult(
      responses[1],
      (data) => data ?? { sectionsData: [], topicsData: [] },
      'Error occurs while getting sectionsData and topicsData in story page',
      logFields
    )

    return { headerData, flashNewsData }
  } catch (err) {
    logAxiosError(
      err as Error,
      `Error occurs while getting header data in story page (slug: ${slug})`,
      logFields
    )
    return {
      headerData: { sectionsData: [], topicsData: [] },
      flashNewsData: [],
    }
  }
}
