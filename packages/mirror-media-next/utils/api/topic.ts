import client from '../../apollo/apollo-client'
import { fetchTopic } from '../../apollo/query/topics'

export function fetchTopicByTopicSlug(
  topicSlug: string,
  postsTake: number,
  postsSkip: number
) {
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
      postsOrderBy: [
        { isFeatured: 'desc' },
        { publishedDate: 'desc' },
        { id: 'desc' },
      ],
      postsTake,
      postsSkip,
    },
  })
}
