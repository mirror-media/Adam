import client, { getStoryClient } from '../../apollo/apollo-client'
import { fetchStoryTopics, fetchTopics } from '../../apollo/query/topics'
import { STORY_GQL_ENDPOINT } from '../../config/index.mjs'

export function fetchTopicList(take: number, skip: number) {
  // Use story endpoint if available, fallback to default client
  const storyClient = getStoryClient(STORY_GQL_ENDPOINT)
  const topicClient = storyClient || client

  return topicClient.query({
    query: storyClient ? fetchStoryTopics : fetchTopics,
    variables: {
      take,
      skip,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      filter: { state: { equals: 'published' } },
    },
  })
}
