import { graphql } from '../__generated__/content'

export type Contact = {
  id: string
  name: string
}

export const contact = graphql(`
  fragment contact on Contact {
    id
    name
  }
`)
