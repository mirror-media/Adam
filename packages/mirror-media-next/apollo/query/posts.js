import { gql } from '@apollo/client'

import {
  asideListingPost,
  listingPost,
  post,
  postFullContent,
  postTrimmedContent,
  relatedPost,
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

const fetchStoryPostBySlug = gql`
  ${post}
  ${postFullContent}
  ${relatedPost}
  query fetchStoryPostBySlug($slug: String) {
    post(where: { slug: $slug }) {
      ...post
      ...postFullContent
      relatedsOne {
        ...relatedPost
      }
      relatedsTwo {
        ...relatedPost
      }
    }
  }
`

const fetchAmpPostBySlug = gql`
  ${post}
  ${postTrimmedContent}
  ${postFullContent}
  ${relatedPost}
  query fetchAmpPostBySlug($slug: String) {
    post(where: { slug: $slug }) {
      ...post
      ...postTrimmedContent
      ...postFullContent
      relatedsOne {
        ...relatedPost
      }
      relatedsTwo {
        ...relatedPost
      }
    }
  }
`

export { fetchAmpPostBySlug, fetchAsidePosts, fetchPosts, fetchStoryPostBySlug }
