import client from '../../apollo/apollo-client'
import { fetchTopic } from '../../apollo/query/topics'

/**
 * @param {string} topicSlug
 * @param {number} postsTake
 * @param {number} postsSkip
 */
export function fetchTopicByTopicSlug(topicSlug, postsTake, postsSkip) {
  return client.query({
    query: fetchTopic,
    variables: {
      topicFilter: {
        slug: { equals: topicSlug },
        state: { equals: 'published' },
      },
      postsFilter: { state: { equals: 'published' } },
      featuredPostsCountFilter: {
        state: { equals: 'published' },
        isFeatured: { equals: true },
      },
      postsOrderBy: [{ isFeatured: 'desc' }, { publishedDate: 'desc' }],
      postsTake,
      postsSkip,
    },
  })
}
