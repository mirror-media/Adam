import { gql } from '@apollo/client'
import { partner } from './partner'

/**
 * @typedef {import('./partner').Partner} Partner
 */

/**
 * @typedef {Object} GenericExternal
 * @property {string} id
 * @property {string} slug
 * @property {Partner | null} partner
 * @property {string} title
 * @property {string} state
 * @property {string} publishedDate
 * @property {string} extend_byline - author
 * @property {string} thumb - heroImage URL
 * @property {string} brief
 * @property {string} content
 * @property {string} source - original article URL
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} createdBy
 * @property {string} updatedBy
 */

/**
 * @typedef {Pick<GenericExternal, 'id' | 'slug' | 'partner' |  'title' | 'thumb' | 'brief' | 'content' | 'publishedDate' | 'extend_byline' | 'updatedAt' >} External
 */

/**
 * @typedef {Pick<GenericExternal, 'id' | 'slug' | 'title' | 'thumb' | 'brief' | 'partner'>} ListingExternal
 */

export const listingExternal = gql`
  ${partner}
  fragment listingExternal on External {
    id
    slug
    title
    thumb
    brief
    partner {
      ...partner
    }
  }
`

export const external = gql`
  ${partner}
  fragment external on External {
    id
    slug
    title
    thumb
    brief
    content
    publishedDate
    extend_byline
    partner {
      ...partner
      showThumb
      showBrief
    }
    updatedAt
  }
`
