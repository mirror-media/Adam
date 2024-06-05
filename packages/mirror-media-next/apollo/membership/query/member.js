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

const fetchMemberProfile = gql`
  query fetchMemberProfile($firebaseId: String!) {
    member(where: { firebaseId: $firebaseId }) {
      id
      firebaseId
      email
      name
      gender
      birthday
      phone
      country
      city
      district
      address
    }
  }
`

export { fetchAllMember, fetchSubscription, fetchMemberProfile }
