import { gql } from '@apollo/client'

import { external, listingExternal } from '../fragments/external'

const fetchExternals = gql`
  ${listingExternal}
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
`

const fetchExternalCounts = gql`
  query fetchExternalCounts($filter: ExternalWhereInput!) {
    externalsCount(where: $filter)
  }
`

const fetchExternalBySlug = gql`
  ${external}
  query fetchExternalBySlug($slug: String) {
    externals(
      where: { slug: { equals: $slug }, state: { equals: "published" } }
    ) {
      ...external
    }
  }
`

const fetchLatestPublishedExternals = gql`
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
`

export {
  fetchExternalBySlug,
  fetchExternalCounts,
  fetchExternals,
  fetchLatestPublishedExternals,
}
