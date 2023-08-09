import { gql } from '@apollo/client'
import { listingExternal, external } from '../fragments/external'

const fetchExternalsByPartnerSlug = gql`
  ${listingExternal}
  query (
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
  query ($filter: ExternalWhereInput!) {
    externalsCount(where: $filter)
  }
`

const fetchExternalBySlug = gql`
  ${external}
  query ($slug: String) {
    externals(
      where: { slug: { equals: $slug }, state: { equals: "published" } }
    ) {
      ...external
    }
  }
`

export { fetchExternalsByPartnerSlug, fetchExternalCounts, fetchExternalBySlug }
