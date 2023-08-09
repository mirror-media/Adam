import { gql } from '@apollo/client'

/**
 * @typedef {Object} Tag
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 */

export const tag = gql`
  fragment tag on Tag {
    id
    name
    slug
  }
`
