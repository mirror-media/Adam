import { graphql } from '../__generated__/content'

const fetchCategorySections = graphql(`
  query fetchCategorySections($categorySlug: String) {
    category(where: { slug: $categorySlug }) {
      ...categoryWithSection
    }
  }
`)

const fetchCategory = graphql(`
  query fetchCategory($categorySlug: String) {
    category(where: { slug: $categorySlug }) {
      ...category
    }
  }
`)

export { fetchCategory, fetchCategorySections }
