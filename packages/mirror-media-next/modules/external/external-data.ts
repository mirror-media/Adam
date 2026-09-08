import client, { getStoryClient } from '@/apollo/apollo-client'
import {
  fetchExternalBySlug,
  fetchStoryExternalBySlug,
} from '@/apollo/query/externals'
import { STORY_GQL_ENDPOINT } from '@/config/index.mjs'
import { processSettledResult } from '@/utils/response-processor'

import type { ExternalPost } from './external-types'

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
