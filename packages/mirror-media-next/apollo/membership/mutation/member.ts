import { graphql } from '../../__generated__/member'

const createMember = graphql(`
  mutation createMember($firebaseId: String!, $email: String!) {
    createmember(data: { firebaseId: $firebaseId, email: $email }) {
      firebaseId
      id
    }
  }
`)

const updateMember = graphql(`
  mutation updateMember(
    $id: ID!
    $address: String
    $country: String
    $city: String
    $district: String
    $birthday: String
    $gender: memberGenderType
    $name: String
    $phone: String
  ) {
    updatemember(
      where: { id: $id }
      data: {
        phone: $phone
        gender: $gender
        birthday: $birthday
        name: $name
        address: $address
        city: $city
        country: $country
        district: $district
      }
    ) {
      phone
      gender
      birthday
      name
      address
      city
      country
      district
    }
  }
`)

export { createMember, updateMember }
