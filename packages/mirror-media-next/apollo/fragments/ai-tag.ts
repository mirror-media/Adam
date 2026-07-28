import { graphql } from '../__generated__/content'

export type Tag = {
  id: string
  name: string
  slug: string
}

export const aiTag = graphql(`
  fragment aiTag on Tag {
    id
    name
    slug
  }
`)
