import { graphql } from '../__generated__/content'

export const topic = graphql(`
  fragment topic on Topic {
    id
    slug
    name
    brief
    og_image {
      ...heroImage
    }
    heroImage {
      ...heroImage
    }
    style
    createdAt
  }
`)
