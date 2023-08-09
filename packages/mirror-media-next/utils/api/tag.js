import client from '../../apollo/apollo-client'
import { fetchPosts } from '../../apollo/query/posts'
import { fetchTag } from '../../apollo/query/tags'

/**
 * @param {string} tagSlug
 * @param {number} take
 * @param {number} skip
 */
export function fetchPostsByTagSlug(tagSlug, take, skip) {
  return client.query({
    query: fetchPosts,
    variables: {
      take,
      skip,
      orderBy: { publishedDate: 'desc' },
      filter: {
        state: { equals: 'published' },
        tags: { some: { slug: { equals: tagSlug } } },
      },
    },
  })
}

/**
 * @param {string} tagSlug
 */
export function fetchTagByTagSlug(tagSlug) {
  return client.query({
    query: fetchTag,
    variables: {
      where: { slug: tagSlug },
    },
  })
}
