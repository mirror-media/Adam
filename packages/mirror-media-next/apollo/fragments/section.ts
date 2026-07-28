import { graphql } from '../__generated__/content'

export type SectionWithCategory = {
  id: string
  name: string
  slug: string
  isMemberOnly: boolean
}

export type Section = {
  id: string
  name: string
  slug: string
  state: 'active' | 'inactive'
  categories: SectionWithCategory[]
}

export const section = graphql(`
  fragment section on Section {
    id
    name
    slug
    state
  }
`)

export const sectionWithCategory = graphql(`
  fragment sectionWithCategory on Section {
    id
    name
    slug
    categories(where: { state: { equals: "active" } }) {
      name
      slug
    }
  }
`)
