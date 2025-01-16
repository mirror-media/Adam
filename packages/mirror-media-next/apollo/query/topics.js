import { gql } from '@apollo/client'
import { topic } from '../fragments/topic'
import { slideshowImage } from '../fragments/photo'
import { tag } from '../fragments/tag'
import { topicPost } from '../fragments/post'

/**
 * @typedef {Object} manualOrderOfSlideshowImage
 * @property {string} id
 * @property {string} name
 *
 * @typedef {Object} Topic
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {import('../../type/draft-js').Draft} brief
 * @property {import('../fragments/photo').Photo} heroImage
 * @property {string} heroUrl
 * @property {number} sortOrder
 * @property {string} createdAt
 * @property {string} leading
 * @property {string} type
 * @property {string} style
 * @property {number} postsCount
 * @property {number} featuredPostsCount
 * @property {import('../fragments/post').TopicPost[]} posts
 * @property {import('../fragments/tag').Tag[]} tags
 * @property {string} og_description
 * @property {import('../fragments/photo').Photo} og_image
 * @property {import('../fragments/photo').SlideshowImage[]} slideshow_images
 * @property {manualOrderOfSlideshowImage[]} manualOrderOfSlideshowImages
 * @property {string} dfp
 */

const fetchTopics = gql`
  ${topic}
  query (
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
`

const fetchTopic = gql`
  ${topic}
  ${slideshowImage}
  ${tag}
  ${topicPost}
  query (
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
`

const fetchTopicPostCount = gql`
  query Topic(
    $topicFilter: TopicWhereUniqueInput!
    $postsCountFilter: PostWhereInput
  ) {
    topic(where: $topicFilter) {
      postsCount(where: $postsCountFilter)
    }
  }
`

export { fetchTopics, fetchTopic, fetchTopicPostCount }
