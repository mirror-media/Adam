import NewebPay from '@mirrormedia/newebpay-node'
import {
  NEWEBPAY_PAPERMAG_KEY,
  NEWEBPAY_PAPERMAG_IV,
} from '../../config/index.mjs'

function getRandomMerchantOrderNo() {
  const min = 1000000000
  const max = 9999999999
  const randomTenDigitNumber = Math.floor(Math.random() * (max - min + 1)) + min
  return 'P' + randomTenDigitNumber
}

async function getPaymentDataOfPapermagSubscription(gateWayPayload) {
  const data = {
    MerchantID: 'MS323443601',
    RespondType: 'JSON',
    TimeStamp: '1694018103',
    Version: '1.6',
    MerchantOrderNo: getRandomMerchantOrderNo(),
    Amt: 7280,
    ItemDesc: '一年鏡週刊 52 期加掛號運費',
    LoginType: 0,
    Email: 'test@ww.ww',
    TradeLimit: 900,
    NotifyURL:
      'https://mm-subscription-webhooks-publishers-dev-ufaummkd5q-de.a.run.app/newebpay/magazine',
    ReturnURL: gateWayPayload.returnUrl,
  }
  return data
}

export default async function EncryptInfo(req, res) {
  const tradeInfo = req.body
  try {
    const infoForNewebpay = await getPaymentDataOfPapermagSubscription(
      tradeInfo.data
    )

    const newebpay = new NewebPay(NEWEBPAY_PAPERMAG_KEY, NEWEBPAY_PAPERMAG_IV)
    const encryptPostData = await newebpay.getEncryptedFormPostData(
      infoForNewebpay
    )

    console.log(
      JSON.stringify({
        message: `papermag payload:`,
        debugPayload: {
          'req.body': req.body,
        },
        'logging.googleapis.com/trace': `projects/mirrormedia-1470651750304/traces/papermag`,
      })
    )

    res.send({
      status: 'success',
      data: encryptPostData,
    })
  } catch (e) {
    console.log(e)
    res.status(500).send({
      status: 'error',
      message: e.message,
    })
  }
}
