import errors from '@twreporter/errors'
import NewebPay from '@mirrormedia/newebpay-node'
import {
  NEWEBPAY_PAPERMAG_KEY,
  NEWEBPAY_PAPERMAG_IV,
  SITE_URL,
  ENV,
} from '../../config/index.mjs'
import client from '../../apollo/apollo-client'
import { fetchPaymentDataOfPapermag } from '../../apollo/membership/mutation/magazine-order'
import { PLAN_LIST } from '../../constants/papermag'

// TODO: Add JSDocs
async function fireGqlRequest(mutation, variables) {
  let result = {}
  try {
    result = await client.mutate({
      mutation: mutation,
      context: {
        uri: '/member/graphql',
        headers: {
          'content-type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      },
      variables,
    })
    if (result.errors) {
      throw new Error(result.errors)
    }
  } catch (e) {
    throw new Error(e)
  }

  return result
}

async function getPaymentDataOfMagazineOrders(gateWayPayload) {
  const { data = {} } = await fireGqlRequest(
    fetchPaymentDataOfPapermag,
    gateWayPayload
  )
  data.createNewebpayTradeInfoForMagazineOrder.ReturnURL =
    ENV === 'local'
      ? `http://localhost:3000/papermag/return`
      : `https://${SITE_URL}/papermag/return`
  data.createNewebpayTradeInfoForMagazineOrder.CREDIT = 1
  data.createNewebpayTradeInfoForMagazineOrder.Version = '2.2'

  return data
}

export default async function EncryptInfo(req, res) {
  const tradeInfo = req.body
  try {
    // 防止使用者自行修改 Amt 的值
    // 詳見：https://app.asana.com/1/614399484723017/project/1210077071799813/task/1210384428427743?focus=true
    if (tradeInfo.data?.Amt) {
      throw new Error('Amt is not correct input')
    }

    const data = await getPaymentDataOfMagazineOrders(tradeInfo)
    const infoForNewebpay = data.createNewebpayTradeInfoForMagazineOrder

    const itemCode = tradeInfo.data.merchandise.connect.code
    const item = PLAN_LIST.find((item) => item.code === itemCode)
    if (!item) {
      throw new Error('item is not correct input')
    }
    const itemPrice = item.price
    const totalPrice =
      itemPrice * tradeInfo.data.itemCount -
      (tradeInfo.data.promoteCode ? 80 : 0)
    if (totalPrice !== infoForNewebpay.Amt) {
      throw new Error(
        `Amt is not correct input, Amt is ${infoForNewebpay.Amt}, but should be ${totalPrice}`
      )
    }

    const newebpay = new NewebPay(NEWEBPAY_PAPERMAG_KEY, NEWEBPAY_PAPERMAG_IV)
    const encryptPostData = await newebpay.getEncryptedFormPostData(
      infoForNewebpay
    )

    res.send({
      status: 'success',
      data: encryptPostData,
    })
  } catch (e) {
    const annotatingError = errors.helpers.wrap(
      e.message,
      'UnhandledError',
      'Error occurs while submit papermag'
    )
    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(
          annotatingError,
          {
            withStack: true,
            withPayload: true,
          },
          0,
          0
        ),
      })
    )
    // console.error(
    //   JSON.stringify({
    //     message: `papermag payload:`,
    //     debugPayload: {
    //       'req.body': req.body,
    //       error: e.message, // Print the whole error object
    //     },
    //     'logging.googleapis.com/trace': `projects/mirrormedia-1470651750304/traces/papermag`,
    //   })
    // )
    res.status(500).send({
      status: 'error',
      message: e.message,
    })
  }
}
