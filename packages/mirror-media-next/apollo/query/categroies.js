import { gql } from '@apollo/client'
import { category, categroyWithSection } from '../fragments/category'

const fetchCategorySections = gql`
  ${categroyWithSection}
  query ($categorySlug: String) {
    category(where: { slug: $categorySlug }) {
      ...categroyWithSection
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
