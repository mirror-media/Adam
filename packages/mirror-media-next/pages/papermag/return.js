import styled from 'styled-components'
import errors from '@twreporter/errors'
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import Steps from '../../components/subscribe-steps'
import Succeeded from '../../components/papermag/succeeded'
import Failed from '../../components/papermag/failed'
import NewebPay from '@mirrormedia/newebpay-node'
import {
  NEWEBPAY_PAPERMAG_KEY,
  NEWEBPAY_PAPERMAG_IV,
} from '../../config/index.mjs'
import { parseBody } from 'next/dist/server/api-utils/node'

import { getMerchandiseAndShippingFeeInfo } from '../../utils/papermag'

import { ACCESS_PAPERMAG_FEATURE_TOGGLE } from '../../config/index.mjs'

const Wrapper = styled.main`
  min-height: 50vh;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 8px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 20;
  }

  ${({ theme }) => theme.breakpoint.lg} {
    padding: 0;
  }
`

/**
 * @param {Object} props
 * @param {Object[] } props.sectionsData
 * @param {Object[]} props.topicsData
 * @param {string} props.orderStatus
 * @param {Object} props.orderData
 * @return {JSX.Element}
 */
export default function Return({
  sectionsData = [],
  topicsData = [],
  orderData,
  orderStatus = 'fail',
}) {
  const isSucceeded = orderStatus === 'SUCCESS'

  return (
    <Layout
      head={{ title: `紙本雜誌訂閱結果` }}
      header={{
        type: 'default',
        data: { sectionsData: sectionsData, topicsData },
      }}
      footer={{ type: 'default' }}
    >
      <>
        <Steps activeStep={3} />
        <hr />
        <Wrapper>
          {isSucceeded ? <Succeeded orderData={orderData} /> : <Failed />}
        </Wrapper>
      </>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ query, req, res }) {
  setPageCache(res, { cachePolicy: 'no-store' }, req.url)

  const traceHeader = req.headers?.['x-cloud-trace-context']
  let globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
  }

  if (ACCESS_PAPERMAG_FEATURE_TOGGLE !== 'on') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  // Fetch header data
  let sectionsData = []
  let topicsData = []

  try {
    const headerData = await fetchHeaderDataInDefaultPageLayout()
    if (Array.isArray(headerData.sectionsData)) {
      sectionsData = headerData.sectionsData
    }
    if (Array.isArray(headerData.topicsData)) {
      topicsData = headerData.topicsData
    }
  } catch (err) {
    const annotatingAxiosError = errors.helpers.annotateAxiosError(err)
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingAxiosError, {
          withStack: true,
          withPayload: true,
        }),
        ...globalLogFields,
      })
    )
  }

  let orderData = {}
  let orderStatus = 'fail'

  if (query && Object.prototype.hasOwnProperty.call(query, 'order-fail')) {
    return {
      props: { sectionsData, topicsData, orderStatus, orderData },
    }
  } else if (req.method !== 'POST') {
    return {
      redirect: {
        destination: '/papermag',
        permanent: false,
      },
    }
  }

  try {
    const infoData = await parseBody(req, '1mb')
    if (infoData.Status !== 'SUCCESS') {
      return {
        props: { sectionsData, topicsData, orderStatus, orderData },
      }
    }

    const newebpay = new NewebPay(NEWEBPAY_PAPERMAG_KEY, NEWEBPAY_PAPERMAG_IV)
    const decryptedTradeInfo = await newebpay.getDecryptedTradeInfo(
      infoData.TradeInfo
    )

    const MerchantOrderNo =
      decryptedTradeInfo.Result?.MerchantOrderNo ||
      JSON.parse(Object.keys(decryptedTradeInfo)[0]).Result.MerchantOrderNo

    // TODO: fetch DB
    const mockDate = '2023-09-01'
    const result = {
      data: {
        allMagazineOrders: [
          {
            id: '703',
            orderNumber: MerchantOrderNo,
            purchaseDatetime: mockDate,
            merchandise: {
              name: '鏡週刊紙本雜誌 52 期',
              code: 'magazine_one_year',
              price: 2880,
            },
            itemCount: 1,
            totalAmount: 2800,
            purchaseName: '購買者',
            purchaseEmail: 'readr@gmail.com',
            purchaseMobile: '0911111111',
            purchaseAddress: '台南市新營區林口街119號6樓之5',
            receiveName: '訂購者',
            receiveMobile: '0911111111',
            receiveAddress: '台南市新營區林口街119號6樓之5',
            createdAt: mockDate,
            promoteCode: 'MJ00012345',
          },
        ],
      },
    }
    if (result.errors) console.log(result.errors[0].message)
    const decryptInfoData = result?.data?.allMagazineOrders[0]
    if (!decryptInfoData) {
      return {
        props: { sectionsData, topicsData, orderStatus, orderData },
      }
    }

    const { itemCount, promoteCode, totalAmount } = decryptInfoData

    const { name, shippingFee } = getMerchandiseAndShippingFeeInfo(
      decryptInfoData?.merchandise?.code
    )

    const discount = promoteCode ? 80 * itemCount : 0
    const shippingCost = shippingFee * itemCount

    const orderInfoPurchasedList = {
      name,
      itemCount,
      costWithoutShipping: totalAmount - shippingCost - discount,
      shippingCost,
      discount,
      total: totalAmount,
    }

    orderData = {
      orderId: decryptInfoData.orderNumber,
      date: decryptInfoData.createdAt,
      discountCode: decryptInfoData.promoteCode,
      orderInfoPurchasedList,
      purchaseName: decryptInfoData.purchaseName,
      purchaseEmail: decryptInfoData.purchaseEmail,
      purchaseMobile: decryptInfoData.purchaseMobile,
      purchaseAddress: decryptInfoData.purchaseAddress,
      receiveName: decryptInfoData.receiveName,
      receiveMobile: decryptInfoData.receiveMobile,
      receiveAddress: decryptInfoData.receiveAddress,
    }
    orderStatus = infoData.Status
  } catch (e) {
    console.log(e)
  }

  return {
    props: {
      sectionsData,
      topicsData,
      orderData,
      orderStatus,
    },
  }
}
