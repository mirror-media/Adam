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

  return data
}

export default async function EncryptInfo(req, res) {
  const tradeInfo = req.body
  try {
    const data = await getPaymentDataOfMagazineOrders(tradeInfo)
    const infoForNewebpay = data.createNewebpayTradeInfoForMagazineOrder
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
