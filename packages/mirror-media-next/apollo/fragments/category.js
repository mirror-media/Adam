import { gql } from '@apollo/client'
import { section } from './section'

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {boolean} isMemberOnly
 * @property {import('./section').Section[]} sections it's singular but wrongly named as plural
 */

export const category = gql`
  fragment category on Category {
    id
    name
    slug
  }
`

export const categroyWithSection = gql`
  ${section}
  fragment categroyWithSection on Category {
    id
    name
    slug
    isMemberOnly
    sections {
      ...section
    }
  }
`
