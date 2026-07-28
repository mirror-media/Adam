import { graphql } from '../__generated__/content'

import type { Tag as AiTag } from './ai-tag'
import type { Partner as PartnerData } from './partner'
import type { Related } from './post'
import type { Tag } from './tag'

export type Partner = PartnerData

export type GenericExternal = {
  id: string
  slug: string
  partner: Partner | null
  title: string
  state: string
  publishedDate: string
  extend_byline: string // Author
  thumb: string // Hero image URL
  thumbCaption: string // Hero image caption
  brief: string
  content: string
  source: string // Original article URL
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  relateds: Related[] // Articles selected by CMS users
  tags: Tag[]
  tags_algo: AiTag[]
}

export type ListingExternal = Pick<
  GenericExternal,
  'id' | 'slug' | 'title' | 'thumb' | 'brief' | 'partner' | 'publishedDate'
>

export type External = Pick<
  GenericExternal,
  | 'id'
  | 'slug'
  | 'partner'
  | 'title'
  | 'thumb'
  | 'thumbCaption'
  | 'brief'
  | 'content'
  | 'publishedDate'
  | 'extend_byline'
  | 'updatedAt'
  | 'relateds'
  | 'tags'
  | 'tags_algo'
>

export const listingExternal = graphql(`
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
`)

export const external = graphql(`
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
`)
