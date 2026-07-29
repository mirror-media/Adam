import { graphql } from '../__generated__/content'

export type ImageFile = {
  width: number
  height: number
}

export type Resized = {
  original: string
  w480: string
  w800: string
  w1200: string
  w1600: string
  w2400: string
}

export type Photo = {
  id: string
  name: string
  imageFile: ImageFile
  resized: Resized
  resizedWebp: Resized
}

export type SlideshowImage = {
  id: string
  resized: Resized
  resizedWebp: Resized
  name: string
  topicKeywords: string
}

export const heroImage = graphql(`
  fragment heroImage on Photo {
    imageFile {
      width
      height
    }
    resized {
      original
      w480
      w800
      w1200
      w1600
      w2400
    }
    resizedWebp {
      original
      w480
      w800
      w1200
      w1600
      w2400
    }
  }
`)

export const relatedPostHeroImage = graphql(`
  fragment relatedPostHeroImage on Photo {
    resized {
      original
      w480
      w800
    }
    resizedWebp {
      original
      w480
      w800
    }
  }
`)

export const slideshowImage = graphql(`
  fragment slideshowImage on Photo {
    id
    resized {
      original
      w480
      w800
      w1200
      w1600
      w2400
    }
    name
    topicKeywords
  }
`)
