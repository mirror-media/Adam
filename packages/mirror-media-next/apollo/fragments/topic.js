import { gql } from '@apollo/client'
import { heroImage } from './photo'

export const topic = gql`
  ${heroImage}
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
  }
`
