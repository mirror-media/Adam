import { gql } from '@apollo/client'

const fetchContact = gql`
  query ($where: ContactWhereUniqueInput!) {
    contact(where: $where) {
      id
      name
    }
  }
`
export { fetchContact }
