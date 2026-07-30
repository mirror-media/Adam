import { graphql } from '../__generated__/content'
import { FetchStoryPostBySlugDocument as fetchStoryPostBySlug } from '../__generated__/story/graphql'

const fetchAsidePosts = graphql(`
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
`)

const fetchPosts = graphql(`
  query fetchPosts(
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
`)

const fetchContentStoryPostBySlug = graphql(`
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
`)

const fetchAmpPostBySlug = graphql(`
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
`)

export {
  fetchAmpPostBySlug,
  fetchAsidePosts,
  fetchContentStoryPostBySlug,
  fetchPosts,
  fetchStoryPostBySlug,
}
