import { gql } from '@apollo/client'

/**
 * @typedef {Object} Member
 * @property {string} id
 * @property {string | null} firebaseId
 * @property {string | null} email
 * @property {string | null} name
 * @property {string | null} gender
 * @property {string | null} birthday
 * @property {string | null} phone
 * @property {string | null} country
 * @property {string | null} city
 * @property {string | null} district
 * @property {string | null} address
 */

export const fetchMemberProfile = gql`
  query fetchMemberProfile($firebaseId: String!) {
    member(where: { firebaseId: $firebaseId }) {
      id
      firebaseId
      email
      name
      gender
      birthday
      phone
      country
      city
      district
      address
    }
  }
`
