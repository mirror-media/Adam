import client from '../../apollo/apollo-client'
import { fetchPosts } from '../../apollo/query/posts'
import { fetchSection } from '../../apollo/query/sections'

/**
 * @param {string} sectionSlug
 * @param {number} take
 * @param {number} skip
 * @returns
 */
export function fetchPremiumPostsBySectionSlug(sectionSlug, take, skip) {
  return client.query({
    query: fetchPosts,
    variables: {
      take,
      skip,
      orderBy: { publishedDate: 'desc' },
      filter: {
        state: { equals: 'published' },
        sections: { some: { slug: { equals: sectionSlug } } },
        isMember: { equals: true },
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
