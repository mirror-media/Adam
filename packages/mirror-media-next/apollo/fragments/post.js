import { gql } from '@apollo/client'
import { heroImage } from './photo'
import { category, categoryWithSection } from './category'
import { section } from './section'
import { contact } from './contact'
import { tag } from './tag'
import { heroVideo } from './video'

/**
 * @typedef {Object} ListingPost
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} publishedDate
 * @property {import('../../type/draft-js').Draft} brief
 * @property {import('./category').Category[]} categories
 * @property {import('./section').Section[] } sections
 * @property {import('./photo').Photo | null} heroImage
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
    sections(where: { state: { equals: "active" } }) {
      ...section
    }
    categories(where: { state: { equals: "active" } }) {
      ...category
    }
    heroImage {
      ...heroImage
    }
    isFeatured
  }
`

/**
 * @typedef {Object} AsideListingPost
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {import('./section').Section[]} sections
 * @property {import('./section').Section[]} sectionsInInputOrder
 * @property {import('./photo').Photo | null} heroImage
 */

export const asideListingPost = gql`
  ${section}
  ${heroImage}
  fragment asideListingPost on Post {
    id
    slug
    title
    sections(where: { state: { equals: "active" } }) {
      ...section
    }
    sectionsInInputOrder {
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
 * @typedef {import('./category').Category} Category - category information
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
 * @property {string} id - unique id
 * @property {string} slug - post slug
 * @property {string} title - post title
 * @property {HeroImage} heroImage - hero image of the post
 */

/**
 * @typedef {import('../../type/draft-js').Draft} Draft
 */

/**
 * @typedef {Object} Post
 * @property {string} id - unique id of post
 * @property {string} slug - post slug
 * @property {string} title - post title
 * @property {string} subtitle - post subtitle
 * @property {string} publishedDate - post published date
 * @property {string} updatedAt - post updated date
 * @property {PostState} state - post state, different states will have different post access of viewing
 * @property {'article'| 'wide' | 'projects' | 'photography' | 'script' | 'campaign' | 'readr'} style - what kind of article style is
 * @property {boolean} isMember - whether this post is a member article
 * @property {boolean} isAdult - whether this post only adults can read
 * @property {Section[] | null } sections - which sections does this post belong to
 * @property {Section[] | null} sectionsInInputOrder - sections with adjusted order
 * @property {Pick<Category, 'id' | 'name'  | 'slug' | 'state'>[] } categories - which categories does this post belong to
 * @property {Pick<Category, 'id' | 'name'  | 'slug' | 'state'>[] | null} categoriesInInputOrder - categories with adjusted order
 * @property {Contact[] | null} writers -  the field called '作者' in cms
 * @property {Contact[] | null} writersInInputOrder - writers with adjusted order
 * @property {Contact[] } photographers - the field called '攝影' in cms
 * @property {Contact[] } camera_man - the field called '影音' in cms
 * @property {Contact[] } designers - the field called '設計' in cms
 * @property {Contact[] } engineers - the field called '工程' in cms
 * @property {Contact[] } vocals - the field called '主播' in cms
 * @property {string} extend_byline - the field called '作者(其他)' in cms
 * @property {Tag[] } tags - tags of the post
 * @property {HeroVideo | null} heroVideo - hero video of the post
 * @property {HeroImage | null} heroImage - hero image of the post
 * @property {string} heroCaption - caption to explain hero video or image
 * @property {Draft} brief - post brief
 * @property {Draft} content - post content
 * @property {Draft} trimmedContent - post trimmed content
 * @property {Related[] } relateds related articles selected by cms users
 * @property {Related[] } relatedsInInputOrder related articles with adjusted order
 * @property {boolean} isFeatured
 * @property {import('./tag').Tag[]} tags
 * @property {string} redirect - post redirect slug or external url
 * @property {HeroImage | null} og_image - og image of the post
 * @property {string} og_description - og description of the post
 * @property {boolean} hiddenAdvertised - decide whether to display advertisements
 * @property {boolean} isAdvertised - the field called '廣告文案' in cms
 */

export const post = gql`
  ${section}
  ${category}
  ${categoryWithSection}
  ${contact}
  ${tag}
  ${heroImage}
  ${heroVideo}
  fragment post on Post {
    id
    slug
    title
    subtitle
    state
    style
    isMember
    isAdult
    publishedDate
    updatedAt
    sections(where: { state: { equals: "active" } }) {
      ...section
    }
    sectionsInInputOrder {
      ...section
    }
    categories(where: { state: { equals: "active" } }) {
      ...categoryWithSection
    }
    categoriesInInputOrder {
      ...category
    }

    writers {
      ...contact
    }
    writersInInputOrder {
      ...contact
    }
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
    relateds {
      id
      slug
      title
      heroImage {
        ...heroImage
      }
    }
    relatedsInInputOrder {
      id
      slug
      title
      heroImage {
        ...heroImage
      }
    }
    redirect
    og_image {
      resized {
        w1600
      }
    }
    og_description
    hiddenAdvertised
    isAdvertised
  }
`

export const postTrimmedContent = gql`
  fragment postTrimmedContent on Post {
    trimmedContent
  }
`
export const postFullContent = gql`
  fragment postFullContent on Post {
    content
  }
`
