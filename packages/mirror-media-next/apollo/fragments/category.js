import { gql } from '@apollo/client'
import { section } from './section'

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {boolean} isMemberOnly
 * @property {"active" | "inactive"} state
 * @property {import('./section').Section[]} sections it's singular but wrongly named as plural
 */

export const category = gql`
  fragment category on Category {
    id
    name
    slug
    state
  }
`

export const categoryWithSection = gql`
  ${section}
  fragment categoryWithSection on Category {
    id
    name
    slug
    state
    isMemberOnly
    sections(where: { state: { equals: "active" } }) {
      ...section
    }
  }
`
