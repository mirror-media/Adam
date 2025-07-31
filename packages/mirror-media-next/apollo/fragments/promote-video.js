import { gql } from '@apollo/client'

/**
 * @typedef {Object} PromoteVideo
 * @property {string} id
 * @property {string} videoLink
 */

export const promoteVideo = gql`
  fragment promoteVideo on PromoteVideo {
    id
    videoLink
  }
`
