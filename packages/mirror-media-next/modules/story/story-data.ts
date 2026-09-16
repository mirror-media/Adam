import type { RawDraftContentState } from 'draft-js'

import client, { getStoryClient } from '@/apollo/apollo-client'
import {
  fetchContentStoryPostBySlug,
  fetchStoryPostBySlug,
} from '@/apollo/query/posts'
import { IS_PREVIEW_MODE, STORY_GQL_ENDPOINT } from '@/config/index.mjs'

import type { FaqsAlgo, StoryPost, StoryPostQueryResult } from './story-types'

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
