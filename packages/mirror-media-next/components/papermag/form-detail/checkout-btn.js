import { useState } from 'react'
import styled from 'styled-components'
import Spinner from './spinner'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
`

const StyledCheckoutBtn = styled.button`
  width: 100%;
  height: 48px;
  max-width: 420px;
  min-height: 48px;
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
  line-height: 100%;
  font-weight: 500;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.07);
  background: #054f77;
  color: #fff;
  :focus {
    outline: none;
  }

  :hover {
    background: #9cb7c6;
    color: rgba(0, 0, 0, 0.87);
  }

  transition: all 0.25s ease;

  &[disabled] {
    background: #e3e3e3;
    color: rgba(0, 0, 0, 0.3);
    cursor: default;
  }
`

export default function CheckoutBtn({ isAcceptedConditions, receiptOption }) {
  const [isLoading, setIsLoading] = useState(false)
  const isButtonDisabled = !isAcceptedConditions || receiptOption === null

  const handleCheckout = () => {
    if (!isAcceptedConditions || receiptOption === null) {
      return
    }

    setIsLoading(true)

    // Simulate an API call or some asynchronous operation
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Wrapper>
      <StyledCheckoutBtn disabled={isButtonDisabled} onClick={handleCheckout}>
        {isLoading ? <Spinner /> : '確認訂購'}
      </StyledCheckoutBtn>
    </Wrapper>
  )
}
