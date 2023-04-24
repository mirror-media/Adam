import { gql } from '@apollo/client'

/**
 * @typedef  {import('./photo').Photo} HeroImage
 */

/**
 * @typedef {Object} HeroVideo - certain video information
 * @property {string} [id] - unique id
 * @property {string} [urlOriginal] - video url
 * @property {Pick<HeroImage,'id'> & Pick<HeroImage['resized'], 'original'>} [heroImage] - video url
 */

export const heroVideo = gql`
  fragment heroVideo on Video {
    id
    urlOriginal
    heroImage {
      id
      resized {
        original
      }
    }
  }
`
