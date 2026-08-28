/**
 * The author shape the author page renders.
 * It is not the GraphQL result: `fetchContact` returns `name` as nullable, so
 * the route normalizes into this before the page and its components read it.
 */
export type AuthorSummary = {
  id: string
  name: string
}
