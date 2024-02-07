import axios from 'axios'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import MerchandiseItem from './form-detail/merchandise-item'
import ApplyDiscount from './form-detail/apply-discount'
import PurchaseInfo from './form-detail/purchase-info'
import Shipping from './form-detail/shipping'
import Receipt from './form-detail/receipt'
import AcceptingTermsAndConditions from './form-detail/accepting-terms-and-conditions'
import CheckoutBtn from './form-detail/checkout-btn'
import Orderer from './form-detail/orderer'
import Recipient from './form-detail/recipient'
import NewebpayForm from './form-detail/newebpay-form'

import { NEWEBPAY_PAPERMAG_API_URL } from '../../config/index.mjs'
import { useRouter } from 'next/router'

const Form = styled.form`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 0 8px;

  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: row;
  }
`

const LeftWrapper = styled.div`
  width: 100%;
  padding: 0 10px;

  ${({ theme }) => theme.breakpoint.md} {
    max-width: 500px;
    margin-right: 20px;
  }

  ${({ theme }) => theme.breakpoint.lg} {
    margin-right: 60px;
    padding: 0;
  }
`
const RightWrapper = styled.div`
  width: 100%;

  ${({ theme }) => theme.breakpoint.md} {
    max-width: 400px;
  }
`

export default function SubscribePaperMagForm({ plan }) {
  const router = useRouter()

  const [count, setCount] = useState(1)
  const [renewCouponApplied, setRenewCouponApplied] = useState(false)
  const [shouldCountFreight, setShouldCountFreight] = useState(false)
  const [promoteCode, setPromoteCode] = useState(null)

  const [ordererValues, setOrdererValues] = useState({
    username: '',
    cellphone: '',
    phone: '',
    phoneExt: '',
    address: '',
    email: '',
  })

  const [recipientValues, setRecipientValues] = useState({
    username: '',
    cellphone: '',
    phone: '',
    phoneExt: '',
    address: '',
  })

  const [paymentPayload, setPaymentPayload] = useState({
    MerchantID: '',
    TradeInfo: '',
    TradeSha: '',
    Version: '',
  })

  const [sameAsOrderer, setSameAsOrderer] = useState(false)
  const [isAcceptedConditions, setIsAcceptedConditions] = useState(false)
  const [receiptOption, setReceiptOption] = useState(null)

  //show a warning message if the isAcceptedConditions is true but the receiptOption is null
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (isAcceptedConditions && receiptOption === null) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
    }
  }, [isAcceptedConditions, receiptOption])

  const [receiptData, setReceiptData] = useState(null) // update the receiptData state

  const handleSubmit = async (event) => {
    event.preventDefault()

    // TODO: Check form validity again

    const merchandiseName = `magazine_${plan === 2 ? 'two' : 'one'}_year${
      shouldCountFreight ? '_with_shipping_fee' : ''
    }`
    const orderDesc = `${
      plan === 1 ? '一年鏡週刊 52 期' : '二年鏡週刊 104 期'
    }${shouldCountFreight ? '加掛號運費' : ''}`
    const promoteCodeStr = promoteCode ? `MR${promoteCode}` : ''
    const loveCode =
      receiptOption === 'donate' ? Number(receiptData.value.code) : null
    const receiptType = receiptOption === 'tripleInvoice' ? 'B2B' : 'B2C'
    const buyerName =
      receiptOption === 'tripleInvoice' ? receiptData.value['抬頭'] : ''
    const buyerUBN =
      receiptOption === 'tripleInvoice' ? receiptData.value['統一編號'] : ''

    let carrierType = '' //載具類別
    let carrierNum = '' //載具編號
    let recipient = recipientValues //收件者資料

    if (sameAsOrderer) {
      recipient = { ...ordererValues }
    }

    if (receiptOption === 'invoiceWithCarrier') {
      switch (receiptData.name) {
        case '二聯式發票（含載具）- 手機條碼':
          carrierType = '0'
          carrierNum = receiptData.value
          break
        case '二聯式發票（含載具）- 自然人憑證':
          carrierType = '1'
          carrierNum = receiptData.value
          break
        case '二聯式發票（含載具）- 電子發票載具':
          carrierType = '2'
          carrierNum = ordererValues.email
          break
        default:
          carrierNum = ''
          carrierType = ''
          break
      }
    }

    // If everything is valid, proceed with submitting the form data
    // Make an API request or update the state here
    // carry encrypted paymentPayload and submit to newebpay

    const requestBody = {
      data: {
        desc: orderDesc, //訂單描述
        comment: '', //約定事項
        merchandise: {
          connect: {
            code: merchandiseName, //商品名稱
          },
        },
        promoteCode: promoteCodeStr, //使用優惠碼
        itemCount: count, //商品數量
        purchaseDatetime: new Date(), // 訂購時間
        purchaseName: ordererValues.username, //購買者姓名
        purchaseAddress: ordererValues.address, //購買者地址
        purchaseEmail: ordererValues.email, //購買者信箱
        purchaseMobile: ordererValues.cellphone, //購買者手機
        purchasePhone: `${ordererValues.phone} ${ordererValues.phoneExt}`, //購買者電話
        receiveName: recipient.username, //收件者姓名
        receiveAddress: recipient.address, //收件者地址
        receiveMobile: recipient.cellphone, //收件者手機
        receivePhone: `${recipient.phone} ${recipient.phoneExt}`, //收件者電話
        category: receiptType, //發票種類
        loveCode: loveCode, // 捐贈碼
        carrierType: carrierType, //載具類別
        carrierNum: carrierNum, //載具編號（二聯式發票）
        buyerName: buyerName, //買受人名稱（三聯式發票）
        buyerUBN: buyerUBN, //買受人統一編號（三聯式發票）
      },
    }

    const { data } = await axios.post(
      `${window.location.origin}/api/papermag`,
      requestBody
    )
    if (data?.status !== 'success') {
      console.error(data.message)
      router.push(`/papermag/return?order-fail=true`)
    }

    setPaymentPayload(data.data)
    // 為了確保資料先填入 form 中而使用 setTimeout
    setTimeout(() => {
      const formDOM = document.forms.newebpay
      formDOM.submit()
    }, 0)
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <LeftWrapper>
          <MerchandiseItem count={count} setCount={setCount} plan={plan} />
          <ApplyDiscount
            setRenewCouponApplied={setRenewCouponApplied}
            renewCouponApplied={renewCouponApplied}
            promoteCode={promoteCode}
            setPromoteCode={setPromoteCode}
          />
          <Orderer
            ordererValues={ordererValues}
            setOrdererValues={setOrdererValues}
          />
          <Recipient
            recipientValues={recipientValues}
            setRecipientValues={setRecipientValues}
            sameAsOrderer={sameAsOrderer}
            setSameAsOrderer={setSameAsOrderer}
            ordererValues={ordererValues}
          />
          <Shipping
            shouldCountFreight={shouldCountFreight}
            setShouldCountFreight={setShouldCountFreight}
          />
          <Receipt
            receiptOption={receiptOption}
            setReceiptOption={setReceiptOption}
            showWarning={showWarning}
            onReceiptDataChange={setReceiptData}
          />
          <AcceptingTermsAndConditions
            isAcceptedConditions={isAcceptedConditions}
            setIsAcceptedConditions={setIsAcceptedConditions}
          />
          <CheckoutBtn
            isAcceptedConditions={isAcceptedConditions}
            receiptOption={receiptOption}
          />
        </LeftWrapper>
        <RightWrapper>
          <PurchaseInfo
            count={count}
            plan={plan}
            renewCouponApplied={renewCouponApplied}
            shouldCountFreight={shouldCountFreight}
          />
        </RightWrapper>
      </Form>

      <NewebpayForm
        merchantId={paymentPayload.MerchantID}
        tradeInfo={paymentPayload.TradeInfo}
        tradeSha={paymentPayload.TradeSha}
        version={paymentPayload.Version}
        newebpayApiUrl={NEWEBPAY_PAPERMAG_API_URL}
      />
    </>
  )
}
