import { gql } from '@apollo/client'

const fetchSection = gql`
  query ($where: SectionWhereUniqueInput!) {
    section(where: $where) {
      id
      name
      slug
    }
  }
`

export { fetchSection }
