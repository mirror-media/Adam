import { graphql } from '../../__generated__/member'

const fetchAllMember = graphql(`
  query fetchAllMember($firebaseId: String!) {
    member(where: { firebaseId: $firebaseId }) {
      id
      firebaseId
    }
  }
`)
const fetchSubscription = graphql(`
  query fetchSubscription {
    subscriptions {
      id
    }
  }
`)

const fetchMemberProfile = graphql(`
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
`)

export { fetchAllMember, fetchMemberProfile, fetchSubscription }
