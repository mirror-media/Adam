import { graphql } from '../__generated__/member'

const fetchAllMemberByOrderNo = graphql(`
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
`)

export { fetchAllMemberByOrderNo }
