// GetServerSideProps-only: pulls in `utils/server-side-only/fetch-static-json`
// (Node `fs`), so only import this from the page's GSSP, never from
// client-rendered code — see `related-stories-client.ts` for that.
import axios from 'axios'
import type { RawDraftContentState } from 'draft-js'

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
  FaqsAlgo,
  StoryFlashNewsData,
  StoryHeaderData,
  StoryPost,
  StoryPostQueryResult,
} from './story-types'

export function getStoryLayoutType(
  articleStyle: StoryPostQueryResult['style']
) {
  if (articleStyle === 'wide') {
    return 'style-wide'
  } else if (articleStyle === 'photography') {
    return 'style-photography'
  }
  return 'style-normal'
}

export async function getStoryPostBySlug(
  slug: string,
  options?: { preview?: boolean }
) {
  if (options?.preview) {
    return client.query({
      query: fetchContentStoryPostBySlug,
      variables: { slug },
    })
  }

  const storyClient = getStoryClient(STORY_GQL_ENDPOINT)
  if (!storyClient) {
    return client.query({
      query: fetchContentStoryPostBySlug,
      variables: { slug },
    })
  }

  return storyClient.query({
    query: fetchStoryPostBySlug,
    variables: { slug },
  })
}

const EMPTY_DRAFT_CONTENT: RawDraftContentState = { blocks: [], entityMap: {} }

// GraphQL's `Json` scalar has no shape at all (see codegen.ts's `scalars`
// config — it maps to `unknown`), so `brief`/`content` are the one part of
// the response codegen can't type-check for us. Narrow them for real
// against @types/draft-js's RawDraftContentState instead of trusting an
// assertion, the way every other field on the response can be.
function isRawDraftContentState(value: unknown): value is RawDraftContentState {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { blocks?: unknown }).blocks) &&
    typeof (value as { entityMap?: unknown }).entityMap === 'object' &&
    (value as { entityMap?: unknown }).entityMap !== null
  )
}

function toDraftContentState(value: unknown): RawDraftContentState {
  return isRawDraftContentState(value) ? value : EMPTY_DRAFT_CONTENT
}

// `faqs_algo` is `null` whenever a post has no auto-generated FAQ (most
// posts), so unlike `brief`/`content` there's no meaningful empty default to
// fall back to — an unrecognized shape is treated the same as "no FAQ".
function isFaqsAlgo(value: unknown): value is FaqsAlgo {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { faqs?: unknown }).faqs) &&
    typeof (value as { generated_at?: unknown }).generated_at === 'string'
  )
}

function toFaqsAlgo(value: unknown): FaqsAlgo | null {
  return isFaqsAlgo(value) ? value : null
}

export async function fetchStoryPost(slug: string): Promise<StoryPost | null> {
  const result = await getStoryPostBySlug(slug, { preview: IS_PREVIEW_MODE })
  const postData = result.data?.post

  if (!postData) {
    return null
  }

  return {
    ...postData,
    brief: toDraftContentState(postData.brief),
    content: toDraftContentState(postData.content),
    faqs_algo: toFaqsAlgo(postData.faqs_algo),
  }
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
