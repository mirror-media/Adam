import { gql } from '@apollo/client'
import { heroImage, slideshowImage } from './photo'
import { post } from './post'
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
 * @property {number} sortOrder
 * @property {string} createdAt
 * @property {string} leading
 * @property {string} type
 * @property {string} style
 * @property {number} postsCount
 * @property {import('./post').Post[]} posts
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
  ${post}
  ${tag}
  fragment topic on Topic {
    id
    slug
    name
    brief
    heroImage {
      ...heroImage
    }
    leading
    type
    style
    postsCount(where: $postsFilter)
    posts(
      where: $postsFilter
      orderBy: $postsOrderBy
      take: $postsTake
      skip: $postsSkip
    ) {
      ...post
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
