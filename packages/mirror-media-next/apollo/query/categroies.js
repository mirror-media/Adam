import { gql } from '@apollo/client'
import { category, categoryWithSection } from '../fragments/category'

const fetchCategorySections = gql`
  ${categoryWithSection}
  query ($categorySlug: String) {
    category(where: { slug: $categorySlug }) {
      ...categoryWithSection
    }
  }
`

const fetchCategory = gql`
  ${category}
  query ($categorySlug: String) {
    category(where: { slug: $categorySlug }) {
      ...category
    }
  }
`

export { fetchCategorySections, fetchCategory }
