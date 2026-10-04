import type { FetchExternalBySlugQuery as ContentFetchExternalBySlugQuery } from '@/apollo/__generated__/content/graphql'
import type { FetchExternalBySlugQuery as StoryFetchExternalBySlugQuery } from '@/apollo/__generated__/story/graphql'
import type { Resized } from '@/apollo/fragments/photo'
import type { Related } from '@/apollo/fragments/post'

// The raw shape GraphQL actually returns for either endpoint, straight from
// codegen — content and story schemas are queried with the same fields but
// produce distinct generated types. `externals` is a list query; this page
// only ever reads the first match.
export type ExternalQueryResult =
  | NonNullable<ContentFetchExternalBySlugQuery['externals']>[number]
  | NonNullable<NonNullable<StoryFetchExternalBySlugQuery['externals']>[number]>

// `brief`/`content` are plain nullable strings on this schema (unlike Post's
// Draft.js `Json` scalar), so the codegen shape needs no further narrowing.
export type ExternalPost = ExternalQueryResult

// Related items come from two different sources that don't share a single
// GraphQL shape: `external.relateds` (GraphQL, typed above) and the MISO
// recommendation API (see related-stories-client.ts). `Related` is the
// hand-authored cross-source view-model already used by the shared
// `RelatedArticleList`/`AsideArticleList` components.
export type ExternalRelatedStory = Omit<Related, 'heroImage'> & {
  id: string
  slug: string
  title: string
  // MISO-sourced items only carry a resized `original` URL, so this is
  // looser than the GraphQL `HeroImage` shape GSSP-sourced items provide.
  heroImage: {
    id?: string
    resized?: Partial<Record<keyof Resized, string | null>> | null
    resizedWebp?: Partial<Record<keyof Resized, string | null>> | null
  } | null
  url: string
  type: 'story' | 'external'
  // Only MISO-sourced items carry these placeholder fields; GraphQL-sourced
  // relateds don't select them.
  brief?: { blocks: { text: string }[] }
  categories?: unknown[]
  sections?: unknown[]
}
