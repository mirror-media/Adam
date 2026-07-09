import { graphql } from '../__generated__/content'
import { FetchExternalBySlugDocument as fetchStoryExternalBySlug } from '../__generated__/story/graphql'

const fetchExternals = graphql(`
  query fetchExternals(
    $take: Int
    $skip: Int
    $orderBy: [ExternalOrderByInput!]!
    $filter: ExternalWhereInput!
  ) {
    externals(take: $take, skip: $skip, orderBy: $orderBy, where: $filter) {
      ...listingExternal
    }
  }
`)

const fetchExternalCounts = graphql(`
  query fetchExternalCounts($filter: ExternalWhereInput!) {
    externalsCount(where: $filter)
  }
`)

const fetchExternalBySlug = graphql(`
  query fetchExternalBySlug($slug: String) {
    externals(
      where: { slug: { equals: $slug }, state: { equals: "published" } }
    ) {
      ...external
    }
  }
`)

const fetchLatestPublishedExternals = graphql(`
  query fetchLatestPublishedExternals($take: Int, $partnerSlug: String) {
    externals(
      take: $take
      where: {
        state: { equals: "published" }
        partner: { slug: { equals: $partnerSlug } }
      }
      orderBy: [{ publishedDate: desc }]
    ) {
      id
      title
      slug
      updatedAt
      publishedDate
    }
  }
`)

export {
  fetchExternalBySlug,
  fetchExternalCounts,
  fetchExternals,
  fetchLatestPublishedExternals,
  fetchStoryExternalBySlug,
}
