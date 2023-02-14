import { gql } from '@apollo/client'

const fetchTag = gql`
  query ($where: TagWhereUniqueInput!) {
    tag(where: $where) {
      id
      name
      slug
    }
  }
`

export { fetchTag }
