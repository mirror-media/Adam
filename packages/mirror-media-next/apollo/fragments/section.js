import { gql } from '@apollo/client'

/**
 * @typedef {Object} SectionWithCategory
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {boolean} isMemberOnly
 */

/**
 * @typedef {Object} Section
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {SectionWithCategory[]} categories
 */

export const section = gql`
  fragment section on Section {
    id
    name
    slug
  }
`

export const sectionWithCategory = gql`
  fragment section on Section {
    id
    name
    slug
    categories {
      name
      slug
    }
  }
`
