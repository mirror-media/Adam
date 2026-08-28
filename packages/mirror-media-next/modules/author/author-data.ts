import type { FetchContactQuery } from '@/apollo/__generated__/content/graphql'

import type { AuthorSummary } from './author-types'

/**
 * The query returns a nullable contact whose `name` is also nullable, so the
 * shape the page renders is built here. A missing contact stays null — the
 * route turns that into a 404.
 */
function toAuthorSummary(
  contact: FetchContactQuery['contact']
): AuthorSummary | null {
  if (!contact) {
    return null
  }

  return {
    id: contact.id,
    name: contact.name ?? '',
  }
}

export { toAuthorSummary }
