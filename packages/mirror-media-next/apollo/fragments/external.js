import { gql } from '@apollo/client'

import { aiTag } from './ai-tag'
import { partner } from './partner'
import { relatedPost } from './post'
import { tag } from './tag'

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
 * @property {string} thumbCaption - heroImage caption
 * @property {string} brief
 * @property {string} content
 * @property {string} source - original article URL
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} createdBy
 * @property {string} updatedBy
 * @property {import('./post').Related[] } relateds related articles selected by cms users
 * @property {import('./tag').Tag[] } tags - tags of the post
 * @property {import('./ai-tag').Tag[]} tags_algo
 */

/**
 * @typedef {Pick<GenericExternal, 'id' | 'slug' | 'title' | 'thumb' | 'brief' | 'partner' | 'publishedDate'>} ListingExternal
 */

export const listingExternal = gql`
  ${partner}
  fragment listingExternal on External {
    id
    slug
    title
    thumb
    brief
    publishedDate
    partner {
      ...partner
    }
  }
`

/**
 * @typedef {Pick<GenericExternal, 'id' | 'slug' | 'partner' |  'title' | 'thumb' | 'thumbCaption' | 'brief' | 'content' | 'publishedDate' | 'extend_byline' | 'updatedAt' | 'relateds' |'tags' | 'tags_algo'>} External
 */

export const external = gql`
  ${partner}
  ${relatedPost}
  ${tag}
  ${aiTag}
  fragment external on External {
    id
    slug
    title
    thumb
    brief
    content
    publishedDate
    extend_byline
    thumbCaption
    partner {
      ...partner
      showThumb
      showBrief
    }
    updatedAt
    relateds {
      ...relatedPost
    }
    tags {
      ...tag
    }
    tags_algo {
      ...aiTag
    }
  }
`
