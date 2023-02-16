import { gql } from '@apollo/client'

/**
 * @typedef {Object} Image
 * @property {Object} resized
 * @property {string} resized.w480
 * @property {string} resized.w800
 * @property {string} resized.w1200
 * @property {string} resized.w1600
 * @property {string} resized.w2400
 * @property {string} resized.original
 */

/**
 * @typedef {Object} Section
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 */

/**
 * @typedef {Object} ListingPost
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} style
 * @property {Section[]} sections
 * @property {Image  | null} heroImage
 */

const listingPost = gql`
  fragment listingPost on Post {
    id
    slug
    title
    style
    sections {
      id
      slug
      name
    }
    heroImage {
      resized {
        w480
        w800
        w1200
        w1600
        w2400
        original
      }
    }
  }
`
export { listingPost }
