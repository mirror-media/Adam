import { gql } from '@apollo/client'

/**
 * @typedef  {import('./photo').Photo} HeroImage
 */

/**
 * @typedef {Object} HeroVideo - certain video information
 * @property {string} id - unique id
 * @property {string} videoSrc - video url
 * @property {Pick<HeroImage, 'id' | 'resized'> & Pick<HeroImage['resized'], 'original'>} heroImage - video url
 */

export const heroVideo = gql`
  fragment heroVideo on Video {
    id
    videoSrc
    heroImage {
      id
      resized {
        original
      }
    }
  }
`
