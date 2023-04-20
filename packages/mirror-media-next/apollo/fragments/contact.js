import { gql } from '@apollo/client'

/**
 * @typedef {Object} Contact
 * @property {string} [id]
 * @property {string} [name]
 */

export const contact = gql`
  fragment contact on Contact {
    id
    name
  }
`
