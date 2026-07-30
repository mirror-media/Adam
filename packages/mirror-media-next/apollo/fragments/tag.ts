import { graphql } from '../__generated__/content'

export type Tag = {
  id: string
  name: string
  slug: string
}

export const tag = graphql(`
  fragment tag on Tag {
    id
    name
    slug
  }
`)
