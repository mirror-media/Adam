import { gql } from '@apollo/client'
import { heroImage } from './photo'
import { category } from './category'
import { section } from './section'

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
