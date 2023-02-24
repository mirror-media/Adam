import { gql } from '@apollo/client'

const fetchPostBySlug = gql`
  query fetchPostBySlug($slug: String) {
    post(where: { slug: $slug }) {
      id
      slug
      title
      titleColor
      subtitle
      style
      state
      publishedDate
      updatedAt
      sections {
        id
        name
        slug
      }

      writers {
        id
        name
      }
      photographers {
        id
        name
      }
      camera_man {
        id
        name
      }
      designers {
        id
        name
      }
      engineers {
        id
        name
      }
      vocals {
        id
        name
      }
      extend_byline
      tags {
        id
        name
      }
      heroVideo {
        id
        name
        urlOriginal
      }
      heroImage {
        id
        name
        resized {
          original
          w480
          w800
          w1200
          w1600
          w2400
        }
      }
      heroCaption
      brief
      content
      relateds {
        id
        slug
        title
        heroImage {
          resized {
            w480
            w800
            w1200
            w1600
            w2400
            original
          }
        }
      }
    }
  }
`

export { fetchPostBySlug }
