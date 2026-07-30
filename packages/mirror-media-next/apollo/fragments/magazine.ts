import { graphql } from '../__generated__/content'

export type Resized = {
  original: string
  w480: string
  w800: string
  w1200: string
  w1600: string
  w2400: string
}

export type CoverPhoto = {
  resized: Resized
  resizedWebp: Resized
}

export type Magazine = {
  id: string
  slug: string
  title: string
  urlOriginal: string
  coverPhoto: CoverPhoto
  type: string
  state: string
  publishedDate: string
  createdAt: string
  updatedAt: string
}

export const magazine = graphql(`
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
      resizedWebp {
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
`)
