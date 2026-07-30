import { graphql } from '../__generated__/content'

import type { Photo } from './photo'

export type HeroImage = Photo

export type HeroVideo = {
  id: string // Unique ID
  videoSrc: string // Video URL
  heroImage: Pick<HeroImage, 'id'> & {
    resized: Pick<HeroImage['resized'], 'original'>
  }
}

export const heroVideo = graphql(`
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
`)
