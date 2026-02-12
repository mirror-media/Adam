import client from '../../apollo/apollo-client'
import { fetchPosts } from '../../apollo/query/posts'
import { fetchTag } from '../../apollo/query/tags'

/**
 * Fetch posts by tag slug, including both manual tags and algorithm tags
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
        OR: [
          { tags: { some: { slug: { equals: tagSlug } } } },
          { tags_algo: { some: { slug: { equals: tagSlug } } } },
        ],
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
