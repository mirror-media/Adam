export type CategorySection = {
  id: string
  name: string
  slug: string
}

/**
 * The category shape the category page renders.
 * It is not the GraphQL result: `fetchCategorySections` returns every field as
 * nullable and selects no nested categories, so the route normalizes into this
 * before the page and its components read it.
 */
export type CategorySummary = {
  id: string
  isMemberOnly: boolean
  name: string
  sections: CategorySection[]
  slug: string
  state: string | null
}
