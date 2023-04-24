import { gql } from '@apollo/client'
import { heroImage } from './photo'

/**
 * @typedef {Object} Topic
 * @property {string} id
 * @property {string} name
 * @property {import('../../type/draft-js').Draft} brief
 * @property {import('./photo').Photo} heroImage
 * @property {number} sortOrder
 * @property {string} createdAt
 */

export const topic = gql`
  ${heroImage}
  fragment topic on Topic {
    id
    name
    brief
    heroImage {
      ...heroImage
    }
    sortOrder
    createdAt
  }
`
