import type { RawDraftContentState } from 'draft-js'

import type { FetchStoryPostBySlugQuery as ContentFetchStoryPostBySlugQuery } from '@/apollo/__generated__/content/graphql'
import type { FetchStoryPostBySlugQuery as StoryFetchStoryPostBySlugQuery } from '@/apollo/__generated__/story/graphql'
import type { Resized } from '@/apollo/fragments/photo'
import type { Related } from '@/apollo/fragments/post'

// The raw shape GraphQL actually returns for either endpoint, straight from
// codegen — content and story schemas are queried with the same fields but
// produce distinct generated types.
export type StoryPostQueryResult =
  | NonNullable<ContentFetchStoryPostBySlugQuery['post']>
  | NonNullable<StoryFetchStoryPostBySlugQuery['post']>

// `faqs_algo`'s real shape, confirmed against live data from a post with
// `auto_faq: true` — GraphQL only types it as the untyped `Json` scalar.
export type FaqsAlgo = {
  faqs: { question: string; answer: string; score: number }[]
  generated_at: string
}

// The view type the story capability works with: `brief`/`content` narrowed
// from GraphQL's untyped `Json` scalar to real draft-js content, and
// `faqs_algo` narrowed to its real shape (see fetchStoryPost's type guards).
// `Post` (the schema type) also has `trimmedContent`/`isFeatured`, but this
// query doesn't select either — they're the AMP query's and the listing
// fragment's fields respectively — and nothing in the story render tree
// reads them, so they're left out rather than faked in. Every other field's
// nullability matches the GraphQL schema exactly as codegen reports it —
// nothing here is asserted past what the response actually guarantees.
export type StoryPost = StoryPostQueryResult & {
  brief: RawDraftContentState
  content: RawDraftContentState
  faqs_algo: FaqsAlgo | null
}

// This page only ever renders full (non-trimmed) content.
export type PostContent = {
  type: 'fullContent'
  data: RawDraftContentState
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
