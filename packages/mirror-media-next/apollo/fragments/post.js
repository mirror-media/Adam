import { gql } from '@apollo/client'
import { heroImage } from './photo'
import { category } from './category'
import { section } from './section'
import { contact } from './contact'
import { tag } from './tag'
import { heroVideo } from './video'

/**
 * @typedef {Object} ListingPost
 * @property {string} [id]
 * @property {string} [slug]
 * @property {string} [title]
 * @property {string} [publishedDate]
 * @property {import('../../type/draft-js').Draft} [brief]
 * @property {import('./category').Category} [categories]
 * @property {import('./section').Section} [sections]
 * @property {import('./photo').Photo} [heroImage]
 */

export const listingPost = gql`
  ${section}
  ${category}
  ${heroImage}
  fragment listingPost on Post {
    id
    slug
    title
    brief
    publishedDate
    state
    sections {
      ...section
    }
    categories {
      ...category
    }
    heroImage {
      ...heroImage
    }
  }
`

/**
 * @typedef {Object} AsideListingPost
 * @property {string} [id]
 * @property {string} [slug]
 * @property {string} [title]
 * @property {import('./section').Section} [sections]
 * @property {import('./photo').Photo} [heroImage]
 */

export const asideListingPost = gql`
  ${section}
  ${heroImage}
  fragment asideListingPost on Post {
    id
    slug
    title
    sections {
      ...section
    }
    heroImage {
      ...heroImage
    }
  }
`

/**
 * @typedef {'published' | 'draft' | 'scheduled' | 'archived' | 'invisible'} PostState
 */

/**
 * @typedef {import('./section').Section} Section - certain section information
 */

/**
 * @typedef {import('./contact').Contact} Contact - certain personal information
 */

/**
 * @typedef {import('./tag').Tag} Tag - certain tag information
 */

/**
 * @typedef {import('./video').HeroVideo} HeroVideo - certain video information
 */

/**
 * @typedef {import('./photo').Photo} HeroImage - certain image information
 */

/**
 * @typedef {Object} Related
 * @property {string} [id] - unique id
 * @property {string} [slug] - post slug
 * @property {string} [title] - post title
 * @property {HeroImage} [heroImage] - hero image of the post
 */

/**
 * @typedef {import('../../type/draft-js').Draft} Draft
 */

/**
 * @typedef {Object} Post
 * @property {string} [id] - unique id of post
 * @property {string} [slug] - post slug
 * @property {string} [title] - post title
 * @property {'dark' | 'light'} [titleColor] - font color of title should be light or dark
 * @property {string} [subtitle] - post subtitle
 * @property {string} [publishedDate] - post published date
 * @property {string} [updatedAt] - post updated date
 * @property {PostState} [state] - post state, different states will have different post access of viewing
 * @property {Section[]} [sections] - which sections does this post belong to
 * @property {Section[] | null} [manualOrderOfSections] - sections with adjusted order
 * @property {Contact[]} [writers] -  the field called '作者' in cms
 * @property {Contact[] | null} [manualOrderOfWriters] - writers with adjusted order
 * @property {Contact[]} [photographers] - the field called '攝影' in cms
 * @property {Contact[]} [camera_man] - the field called '影音' in cms
 * @property {Contact[]} [designers] - the field called '設計' in cms
 * @property {Contact[]} [engineers] - the field called '工程' in cms
 * @property {Contact[]} [vocals] - the field called '主播' in cms
 * @property {string} [extend_byline] - the field called '作者(其他)' in cms
 * @property {Tag[]} [tags] - tags of the post
 * @property {HeroVideo | null} [heroVideo] - hero video of the post
 * @property {HeroImage | null} [heroImage] - hero image of the post
 * @property {string} [heroCaption] - caption to explain hero video or image
 * @property {Draft} [brief] - post brief
 * @property {Draft} [content] - post content
 * @property {Related[] | []} [relateds] related articles selected by cms users
 * @property {Related[] | [] | null} [manualOrderOfRelateds] related articles with adjusted order
 */

export const post = gql`
  ${section}
  ${contact}
  ${tag}
  ${heroImage}
  ${heroVideo}
  fragment post on Post {
    id
    slug
    title
    titleColor
    subtitle
    style
    publishedDate
    updatedAt
    sections {
      ...section
    }
    manualOrderOfSections
    writers {
      ...contact
    }
    manualOrderOfWriters
    photographers {
      ...contact
    }
    camera_man {
      ...contact
    }
    designers {
      ...contact
    }
    engineers {
      ...contact
    }
    vocals {
      ...contact
    }
    extend_byline
    tags {
      ...tag
    }
    heroVideo {
      ...heroVideo
    }
    heroImage {
      ...heroImage
    }
    heroCaption
    brief
    content
    relateds {
      id
      slug
      title
      heroImage {
        ...heroImage
      }
    }
    manualOrderOfRelateds
  }
`
