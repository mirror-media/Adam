import { gql } from '@apollo/client'
import { post } from '../fragments/post'

const fetchPostBySlug = gql`
  ${post}
  query fetchPostBySlug($slug: String) {
    post(where: { slug: $slug }) {
      ...post
    }
  }
`

export { fetchPostBySlug }
