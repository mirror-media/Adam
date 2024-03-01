import { gql } from '@apollo/client'

const createMember = gql`
  mutation createMember($firebaseId: String!, $email: String!) {
    createmember(data: { firebaseId: $firebaseId, email: $email }) {
      firebaseId
      id
    }
  }
`

export { createMember }
