import { gql } from '@apollo/client'

const fetchAllMemberByOrderNo = gql`
  query magazineOrder($orderNumber: String!) {
    magazineOrders(where: { orderNumber: { equals: $orderNumber } }) {
      id
      orderNumber
      purchaseDatetime
      merchandise {
        name
        code
        price
      }
      itemCount
      totalAmount
      purchaseName
      purchaseEmail
      purchaseMobile
      receiveName
      receiveMobile
      receiveAddress
      createdAt
      totalAmount
      promoteCode
    }
  }
`

export { fetchAllMemberByOrderNo }
