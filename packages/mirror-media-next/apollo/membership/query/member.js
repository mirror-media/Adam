import { gql } from '@apollo/client'
const fetchAllMember = gql`
  query fetchAllMember($firebaseId: String!) {
    member(where: { firebaseId: $firebaseId }) {
      id
      firebaseId
    }
  }
`
const fetchSubscription = gql`
  query fetchAllMember {
    subscriptions {
      id
    }
  }
`

export { fetchAllMember, fetchSubscription }
