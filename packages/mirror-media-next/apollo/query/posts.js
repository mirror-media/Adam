import { gql } from '@apollo/client'
import { listingPost } from '../fragments/listing-post'

//TODO: result of fetchListingPost is similar to fetchPosts, should refactor to on gql query if possible

/**
 * @typedef {import('../fragments/listing-post').ListingPost} ResultOfFetchListingPosts
 */

const fetchListingPosts = gql`
  ${listingPost}
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
      ...listingPost
    }
  }
`

const fetchPosts = gql`
  query (
    $take: Int
    $skip: Int
    $orderBy: [PostOrderByInput!]!
    $filter: PostWhereInput!
  ) {
    postsCount(where: $filter)
    posts(take: $take, skip: $skip, orderBy: $orderBy, where: $filter) {
      id
      slug
      title
      brief
      sections {
        slug
        name
      }
      publishedDate
      state
      categories {
        slug
        name
      }
      heroImage {
        imageFile {
          width
          height
        }
        resized {
          original
          w480
          w800
          w1200
          w1600
          w2400
        }
      }
    }
  }
`

export { fetchPosts, fetchListingPosts }
