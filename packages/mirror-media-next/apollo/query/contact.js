import { gql } from '@apollo/client'
import { contact } from '../fragments/contact'

const fetchContact = gql`
  ${contact}
  query ($where: ContactWhereUniqueInput!) {
    contact(where: $where) {
      ...contact
    }
  }
`
export { fetchContact }
