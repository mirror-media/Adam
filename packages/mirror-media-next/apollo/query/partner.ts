import { graphql } from '../__generated__/content'

const fetchPartnerBySlug = graphql(`
  query fetchPartnerBySlug($slug: String) {
    partners(where: { slug: { equals: $slug }, public: { equals: true } }) {
      ...partner
    }
  }
`)

export { fetchPartnerBySlug }
