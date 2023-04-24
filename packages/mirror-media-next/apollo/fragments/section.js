import { gql } from '@apollo/client'

/**
 * @typedef {Object} Section
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 */

export const section = gql`
  fragment section on Section {
    id
    name
    slug
  }
`
