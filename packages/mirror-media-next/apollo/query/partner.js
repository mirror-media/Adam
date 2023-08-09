import { gql } from '@apollo/client'
import { partner } from '../fragments/partner'

const fetchPartnerBySlug = gql`
  ${partner}
  query fetchPartnerBySlug($slug: String) {
    partners(where: { slug: { equals: $slug }, public: { equals: true } }) {
      ...partner
    }
  }
`

export { fetchPartnerBySlug }
