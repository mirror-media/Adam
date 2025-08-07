import client from '../../apollo/apollo-client'
import { fetchPosts } from '../../apollo/query/posts'
import { fetchSection } from '../../apollo/query/sections'

/**
 * @param {string} sectionSlug
 * @param {number} take
 * @param {number} skip
 * @param {Record<string, any>} [filterRules]
 */
export function fetchPostsBySectionSlug(sectionSlug, take, skip, filterRules) {
  return client.query({
    query: fetchPosts,
    variables: {
      take,
      skip,
      orderBy: { publishedDate: 'desc' },
      filter: {
        state: { equals: 'published' },
        sections: { some: { slug: { equals: sectionSlug } } },
        ...filterRules,
      },
    },
  })
}

/**
 * @param {string} sectionSlug
 */
export function fetchSectionBySectionSlug(sectionSlug) {
  return client.query({
    query: fetchSection,
    variables: {
      where: { slug: sectionSlug },
    },
  })
}
