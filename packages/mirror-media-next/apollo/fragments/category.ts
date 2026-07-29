import { graphql } from '../__generated__/content'

import type { Section } from './section'

export type Category = {
  id: string
  name: string
  slug: string
  isMemberOnly: boolean
  state: 'active' | 'inactive'
  sections: Section[]
}

export const category = graphql(`
  fragment category on Category {
    id
    name
    slug
    state
  }
`)

export const categoryWithSection = graphql(`
  fragment categoryWithSection on Category {
    id
    name
    slug
    state
    isMemberOnly
    sections(where: { state: { equals: "active" } }) {
      ...section
    }
  }
`)
