import { gql } from '@apollo/client'

/**
 * @typedef {Object} PasswordState
 * @property {boolean} isSet
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {PasswordState} password
 * @property {string} role
 * @property {boolean} isProtected
 */

/**
 * @typedef {Object} GenericPartner
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} website
 * @property {boolean} public
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} createdBy
 * @property {string} updatedBy
 */

/**
 * @typedef {Pick<GenericPartner, 'id' | 'slug' | 'name'>} Partner
 */

export const partner = gql`
  fragment partner on Partner {
    id
    slug
    name
  }
`
