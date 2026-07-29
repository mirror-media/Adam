import client from '../../apollo/apollo-client'
import { fetchPosts } from '../../apollo/query/posts'
import { fetchSection } from '../../apollo/query/sections'

type FilterRules = Record<string, unknown>

export function fetchPremiumPostsBySectionSlug(
  sectionSlug: string,
  take: number,
  skip: number,
  filterRules?: FilterRules
) {
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
        ...filterRules,
      },
    },
  })
}

export function fetchSectionBySectionSlug(sectionSlug: string) {
  return client.query({
    query: fetchSection,
    variables: {
      where: { slug: sectionSlug },
    },
  })
}
