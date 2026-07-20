import type { Draft as DraftData } from '../../type/draft-js'
import { graphql } from '../__generated__/content'
import type { Topic as QueryTopic } from '../query/topics'

import type { Tag as AiTagData } from './ai-tag'
import type { Category as CategoryData } from './category'
import type { Contact as ContactData } from './contact'
import type { Photo } from './photo'
import type { Section as SectionData } from './section'
import type { Tag as TagData } from './tag'
import type { HeroVideo as HeroVideoData } from './video'

export type Draft = DraftData
export type Section = SectionData
export type Category = CategoryData
export type Contact = ContactData
export type Tag = TagData
export type AiTag = AiTagData
export type HeroVideo = HeroVideoData

export type ListingPost = {
  id: string
  slug: string
  title: string
  publishedDate: string
  brief: Draft
  categories: Category[]
  sections: Section[]
  heroImage: Photo | null
  type?: string
}

export type AsideListingPost = {
  id: string
  slug: string
  title: string
  sections: Section[]
  sectionsInInputOrder: Section[]
  heroImage: Photo | null
}

export type TopicPost = {
  id: string // Unique post ID
  slug: string // Post slug
  title: string // Post title
  publishedDate: string
  brief: Draft
  categories: Pick<Category, 'id' | 'name' | 'slug' | 'state'>[]
  sections: Pick<Section, 'id' | 'name' | 'slug' | 'state'>[]
  writers: Pick<Contact, 'id' | 'name'>[] | null
  writersInInputOrder: Pick<Contact, 'id' | 'name'>[] | null
  heroImage: Pick<Photo, 'imageFile' | 'resized' | 'resizedWebp'> | null
  tags: Tag[]
}

export type PostState =
  | 'published'
  | 'draft'
  | 'scheduled'
  | 'archived'
  | 'invisible'

export type HeroImage = Photo
export type Topic = Pick<QueryTopic, 'slug'>

export type Related = {
  id: string // Unique ID
  slug: string // Post slug
  title: string // Post title
  heroImage: HeroImage
  isMesoRecommend?: boolean
}

export type Post = {
  id: string // Unique post ID
  slug: string // Post slug
  title: string // Post title
  subtitle: string
  og_title: string
  publishedDate: string
  updatedAt: string
  state: PostState
  style:
    | 'article'
    | 'wide'
    | 'projects'
    | 'photography'
    | 'script'
    | 'campaign'
    | 'readr'
  isMember: boolean
  isAdult: boolean
  sections: Section[] | null
  sectionsInInputOrder: Section[] | null
  categories: Category[]
  categoriesInInputOrder: Category[] | null
  writers: Contact[] | null
  writersInInputOrder: Contact[] | null
  photographers: Contact[]
  camera_man: Contact[]
  designers: Contact[]
  engineers: Contact[]
  vocals: Contact[]
  extend_byline: string
  tags: Tag[]
  tags_algo: AiTag[]
  heroVideo: HeroVideo | null
  heroImage: HeroImage | null
  heroCaption: string
  brief: Draft
  content: Draft
  trimmedContent: Draft
  relateds: Related[]
  relatedsInInputOrder: Related[]
  relatedsOne: Related | null
  relatedsTwo: Related | null
  isFeatured: boolean
  redirect: string
  og_image: HeroImage | null
  og_description: string
  hiddenAdvertised: boolean
  isAdvertised: boolean
  topics: QueryTopic | null
  allRelatedStories?: object[]
}

export const listingPost = graphql(`
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
`)

export const asideListingPost = graphql(`
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
`)

export const topicPost = graphql(`
  fragment topicPost on Post {
    id
    slug
    title
    updatedAt
    publishedDate
    brief
    categories(where: { state: { equals: "active" } }) {
      ...category
    }
    sections(where: { state: { equals: "active" } }) {
      ...section
    }
    writers {
      ...contact
    }
    writersInInputOrder {
      ...contact
    }
    heroImage {
      ...heroImage
    }
    tags {
      ...tag
    }
  }
`)

export const postTrimmedContent = graphql(`
  fragment postTrimmedContent on Post {
    trimmedContent
  }
`)

export const postFullContent = graphql(`
  fragment postFullContent on Post {
    content
  }
`)

export const relatedPost = graphql(`
  fragment relatedPost on Post {
    id
    slug
    title
    heroImage {
      ...relatedPostHeroImage
    }
  }
`)

export const post = graphql(`
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
      ...categoryWithSection
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
    tags_algo {
      ...aiTag
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
      ...relatedPost
    }
    relatedsInInputOrder {
      ...relatedPost
    }
    redirect
    og_title
    og_image {
      resized {
        w1600
      }
    }
    og_description
    hiddenAdvertised
    isAdvertised
    topics {
      slug
    }
  }
`)
