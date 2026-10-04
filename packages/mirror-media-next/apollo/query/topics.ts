import type { Draft } from '../../type/draft-js'
import { graphql } from '../__generated__/content'
import { FetchTopicsDocument as fetchStoryTopics } from '../__generated__/story/graphql'
import type { Photo, SlideshowImage } from '../fragments/photo'
import type { TopicPost } from '../fragments/post'
import type { Tag } from '../fragments/tag'

type ManualOrderOfSlideshowImage = {
  id: string
  name: string
}

export type Topic = {
  id: string
  slug: string
  name: string
  brief: Draft
  heroImage: Photo
  heroUrl: string
  sortOrder: number
  createdAt: string
  leading: string
  type: string
  style: string
  postsCount: number
  featuredPostsCount: number
  posts: TopicPost[]
  tags: Tag[]
  og_description: string
  og_image: Photo
  slideshow_images: SlideshowImage[]
  manualOrderOfSlideshowImages: ManualOrderOfSlideshowImage[]
  dfp: string
}

const fetchTopics = graphql(`
  query fetchTopics(
    $take: Int
    $skip: Int
    $orderBy: [TopicOrderByInput!]!
    $filter: TopicWhereInput!
  ) {
    topicsCount(where: $filter)
    topics(take: $take, skip: $skip, orderBy: $orderBy, where: $filter) {
      ...topic
    }
  }
`)

const fetchTopic = graphql(`
  query fetchTopic(
    $topicFilter: TopicWhereInput!
    $postsFilter: PostWhereInput!
    $featuredPostsCountFilter: PostWhereInput
    $postsOrderBy: [PostOrderByInput!]!
    $postsTake: Int
    $postsSkip: Int!
  ) {
    topics(where: $topicFilter) {
      ...topic
      heroUrl
      leading
      type
      postsCount(where: $postsFilter)
      featuredPostsCount: postsCount(where: $featuredPostsCountFilter)
      tags {
        ...tag
      }
      og_description
      slideshow_images {
        ...slideshowImage
      }
      manualOrderOfSlideshowImages
      dfp
      posts(
        where: $postsFilter
        orderBy: $postsOrderBy
        take: $postsTake
        skip: $postsSkip
      ) {
        ...topicPost
        isFeatured
      }
    }
  }
`)

const fetchTopicPostCount = graphql(`
  query fetchTopicPostCount(
    $topicFilter: TopicWhereUniqueInput!
    $postsCountFilter: PostWhereInput
  ) {
    topic(where: $topicFilter) {
      postsCount(where: $postsCountFilter)
    }
  }
`)

const fetchTopicSeoPosts = graphql(`
  query fetchTopicSeoPosts(
    $topicFilter: TopicWhereInput!
    $postsFilter: PostWhereInput!
    $postsTake: Int
    $postsSkip: Int!
  ) {
    topics(where: $topicFilter) {
      posts(
        where: $postsFilter
        orderBy: [{ publishedDate: desc }, { id: desc }]
        take: $postsTake
        skip: $postsSkip
      ) {
        slug
        title
        publishedDate
        updatedAt
        heroImage {
          resized {
            w800
          }
        }
      }
    }
  }
`)

export {
  fetchStoryTopics,
  fetchTopic,
  fetchTopicPostCount,
  fetchTopics,
  fetchTopicSeoPosts,
}
