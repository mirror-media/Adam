import client from '../../apollo/apollo-client'
import { fetchTopics } from '../../apollo/query/topics'

/**
 * @param {number} take
 * @param {number} skip
 */
export function fetchTopicList(take, skip) {
  return client.query({
    query: fetchTopics,
    variables: {
      take,
      skip,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      filter: { state: { equals: 'published' } },
    },
  })
}
