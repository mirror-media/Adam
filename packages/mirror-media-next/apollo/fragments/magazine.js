import { gql } from '@apollo/client'

/**
 * @typedef {Object} Resized
 * @property {string} original
 * @property {string} w480
 * @property {string} w800
 * @property {string} w1200
 * @property {string} w1600
 * @property {string} w2400
 */

/**
 * @typedef {Object} CoverPhoto
 * @property {Resized} resized
 */

/**
 * @typedef {Object} Magazine
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} urlOriginal
 * @property {CoverPhoto} coverPhoto
 * @property {string} type
 * @property {string} state
 * @property {string} publishedDate
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export const magazine = gql`
  fragment magazine on Magazine {
    id
    slug
    title
    urlOriginal
    coverPhoto {
      resized {
        original
        w480
        w800
        w1200
        w1600
        w2400
      }
    }
    type
    state
    publishedDate
    createdAt
    updatedAt
  }
`
