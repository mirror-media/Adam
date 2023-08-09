import { gql } from '@apollo/client'
import {
  listingPost,
  asideListingPost,
  post,
  postTrimmedContent,
  postFullContent,
} from '../fragments/post'

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

const fetchPostBySlug = gql`
  ${post}
  ${postTrimmedContent}
  ${postFullContent}
  query fetchPostBySlug($slug: String) {
    post(where: { slug: $slug }) {
      ...post
      ...postTrimmedContent
      ...postFullContent
    }
  }
`

const fetchPostFullContentBySlug = gql`
  ${postFullContent}
  query fetchPostFullContentBySlug($slug: String) {
    post(where: { slug: $slug }) {
      ...postFullContent
    }
  }
`

export {
  fetchPosts,
  fetchAsidePosts,
  fetchPostBySlug,
  fetchPostFullContentBySlug,
}
