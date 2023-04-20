import { gql } from '@apollo/client'
import { listingPost, asideListingPost } from '../fragments/post'

//TODO: result of fetchListingPost is similar to fetchPosts, should refactor to on gql query if possible

const fetchAsidePosts = gql`
  ${asideListingPost}
  query fetchListingPosts(
    $take: Int
    $sectionSlug: [String!]
    $storySlug: String!
  ) {
    posts(
      take: $take
      orderBy: { publishedDate: desc }
      where: {
        sections: { some: { slug: { in: $sectionSlug } } }
        slug: { not: { equals: $storySlug } }
      }
    ) {
      ...asideListingPost
    }
  }
`

const fetchPosts = gql`
  ${listingPost}
  query (
    $take: Int
    $skip: Int
    $orderBy: [PostOrderByInput!]!
    $filter: PostWhereInput!
  ) {
    postsCount(where: $filter)
    posts(take: $take, skip: $skip, orderBy: $orderBy, where: $filter) {
      ...listingPost
    }
  }
`

export { fetchPosts, fetchAsidePosts }
