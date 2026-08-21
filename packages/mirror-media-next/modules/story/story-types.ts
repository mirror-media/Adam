import type { Resized } from '@/apollo/fragments/photo'
import type { Post, Related } from '@/apollo/fragments/post'
import type { HeadersData, Topics } from '@/utils/api'

export type PostData = Post

// This page only ever renders full (non-trimmed) content.
export type PostContent = {
  type: 'fullContent'
  data: Pick<PostData, 'content'>['content']
  isLoaded: boolean
}

export type StoryLayoutType =
  | 'style-normal'
  | 'style-photography'
  | 'style-wide'

export type RelatedStory = Omit<Related, 'heroImage'> & {
  id: string
  slug: string
  title: string
  // MISO-sourced items only carry a resized `original` URL, so this is
  // looser than the GraphQL `HeroImage` shape GSSP-sourced items provide.
  heroImage: {
    id?: string
    resized?: Partial<Resized>
    resizedWebp?: Partial<Resized>
  } | null
  url: string
  type: 'story' | 'external'
}

export type StoryFlashNewsData = Pick<PostData, 'id' | 'slug' | 'title'>[]

export type StoryHeaderData = {
  sectionsData: HeadersData
  topicsData: Topics
}
