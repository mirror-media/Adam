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
  const [count, setCount] = useState(1)
  const [renewCouponApplied, setRenewCouponApplied] = useState(false)
  const [shouldCountFreight, setShouldCountFreight] = useState(false)
  const [loveCode, setLoveCode] = useState(null)
  const router = useRouter()

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

  const [paymentPayload, setPaymentPlayload] = useState({
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

  // update the receiptData state
  const [receiptData, setReceiptData] = useState({})
  const handleSubmit = async (event) => {
    event.preventDefault()
    // Check for form validity

    // If everything is valid, proceed with submitting the form data
    // Make an API request or update the state here
    // carry encrypted paymentPayload and submit to newebpay

    const code = `magazine_${plan === 2 ? 'two' : 'one'}_year${
      shouldCountFreight ? '_with_shipping_fee' : ''
    }`

    const requestBody = {
      data: {
        desc: 'mock_desc',
        comment: 'mock_comment',
        merchandise: {
          connect: {
            code,
          },
        },
        itemCount: count,
        purchaseDatetime: new Date(),
        purchaseName: ordererValues.username,
        purchaseAddress: ordererValues.address,
        purchaseEmail: ordererValues.email,
        receiveName: recipientValues.username,
        receiveAddress: recipientValues.address,
        category: 'B2C',
        purchaseMobile: ordererValues.cellphone,
        receiveMobile: recipientValues.cellphone,
        loveCode,
        carrierType: receiptData,
        returnUrl: `${window.location.origin}/papermag/return`,
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

    setPaymentPlayload(data.data)
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
            loveCode={loveCode}
            setLoveCode={setLoveCode}
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
