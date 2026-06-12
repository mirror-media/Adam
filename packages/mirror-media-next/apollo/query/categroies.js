import { gql } from '@apollo/client'

import { category, categoryWithSection } from '../fragments/category'

const fetchCategorySections = gql`
  ${categoryWithSection}
  query fetchCategorySections($categorySlug: String) {
    category(where: { slug: $categorySlug }) {
      ...categoryWithSection
    }
  }
`

const fetchCategory = gql`
  ${category}
  query fetchCategory($categorySlug: String) {
    category(where: { slug: $categorySlug }) {
      ...category
    }
  }
`

export { fetchCategory, fetchCategorySections }
