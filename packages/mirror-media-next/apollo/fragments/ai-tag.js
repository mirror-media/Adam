import { gql } from '@apollo/client'

/**
 * @typedef {Object} Tag
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 */

export const aiTag = gql`
  fragment aiTag on Tag {
    id
    name
    slug
  }
`
