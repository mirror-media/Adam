import client, { getStoryClient } from '../../apollo/apollo-client'
import { fetchTopics } from '../../apollo/query/topics'
import { STORY_GQL_ENDPOINT } from '../../config/index.mjs'

/**
 * @param {number} take
 * @param {number} skip
 */
export function fetchTopicList(take, skip) {
  // Use story endpoint if available, fallback to default client
  const topicClient = getStoryClient(STORY_GQL_ENDPOINT) || client
  
  return topicClient.query({
    query: fetchTopics,
    variables: {
      take,
      skip,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      filter: { state: { equals: 'published' } },
    },
  })
}
