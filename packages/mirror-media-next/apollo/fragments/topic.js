import { gql } from '@apollo/client'
import { heroImage, slideshowImage } from './photo'
import { topicPost } from './post'
import { tag } from './tag'

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
 * @property {import('./photo').Photo} heroImage
 * @property {string} heroUrl
 * @property {number} sortOrder
 * @property {string} createdAt
 * @property {string} leading
 * @property {string} type
 * @property {string} style
 * @property {number} postsCount
 * @property {number} featuredPostsCount
 * @property {import('./post').TopicPost[]} posts
 * @property {import('./tag').Tag[]} tags
 * @property {string} og_description
 * @property {import('./photo').Photo} og_image
 * @property {import('./photo').SlideshowImage[]} slideshow_images
 * @property {manualOrderOfSlideshowImage[]} manualOrderOfSlideshowImages
 * @property {string} dfp
 */

export const simpleTopic = gql`
  ${heroImage}
  fragment simpleTopic on Topic {
    id
    slug
    name
    brief
    og_image {
      ...heroImage
    }
    heroImage {
      ...heroImage
    }
    style
  }
`

export const topic = gql`
  ${slideshowImage}
  ${heroImage}
  ${topicPost}
  ${tag}
  fragment topic on Topic {
    id
    slug
    name
    brief
    heroImage {
      ...heroImage
    }
    heroUrl
    leading
    type
    style
    postsCount(where: $postsFilter)
    featuredPostsCount: postsCount(where: $featuredPostsCountFilter)
    posts(
      where: $postsFilter
      orderBy: $postsOrderBy
      take: $postsTake
      skip: $postsSkip
    ) {
      ...topicPost
      isFeatured
    }
    tags {
      ...tag
    }
    og_description
    og_image {
      ...heroImage
    }
    slideshow_images {
      ...slideshowImage
    }
    manualOrderOfSlideshowImages
    dfp
  }
`
