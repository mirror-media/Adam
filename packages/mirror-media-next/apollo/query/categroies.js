import { gql } from '@apollo/client'

const fetchCategorySections = gql`
  query ($categorySlug: String) {
    category(where: { slug: $categorySlug }) {
      id
      name
      slug
      sections {
        id
        name
        slug
      }
    }
  }
`

export { fetchCategorySections }
