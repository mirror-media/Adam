import { gql } from '@apollo/client'

/**
 * @typedef {Object} Event
 * @property {string} name - event name
 * @property {string} link - youtube live link
 * @property {'logo' | 'mod' | 'embedded'} eventType
 * @property {string} publishedDate
 * @property {string} startDate
 * @property {string} startDate
 */

export const modEvent = gql`
  fragment modEvent on Event {
    name
    link
    state
    eventType
    publishedDate
    startDate
    endDate
  }
`
