import { gql } from '@apollo/client'

const fetchPaymentDataOfPapermag = gql`
  mutation fetchPaymentDataOfPapermag(
    $data: createNewebpayTradeInfoForMagazineOrderInput!
  ) {
    createNewebpayTradeInfoForMagazineOrder(data: $data) {
      MerchantID
      RespondType
      TimeStamp
      Version
      MerchantOrderNo
      Amt
      ItemDesc
      LoginType
      Email
      TradeLimit
      NotifyURL
    }
  }
`

export { fetchPaymentDataOfPapermag }
