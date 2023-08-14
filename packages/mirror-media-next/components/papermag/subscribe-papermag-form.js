import { useState, useEffect } from 'react'
import styled from 'styled-components'
import MerchandiseItem from './form-detail/merchandise-item'
import ApplyDiscount from './form-detail/apply-discount'
import PurchaseInfo from './form-detail/purchase-info'
import Shipping from './form-detail/shipping'
import Receipt from './form-detail/receipt'
import AcceptingTermsAndConditions from './form-detail/accepting-terms-and-conditions'
import OrderBtn from './form-detail/checkout-btn'
import Orderer from './form-detail/orderer'
import Recipient from './form-detail/recipient'

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
  padding: 0 16px;

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

  return (
    <Form>
      <LeftWrapper>
        <MerchandiseItem count={count} setCount={setCount} plan={plan} />
        <ApplyDiscount
          setRenewCouponApplied={setRenewCouponApplied}
          renewCouponApplied={renewCouponApplied}
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
        />
        <AcceptingTermsAndConditions
          isAcceptedConditions={isAcceptedConditions}
          setIsAcceptedConditions={setIsAcceptedConditions}
        />
        <OrderBtn
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
  )
}
