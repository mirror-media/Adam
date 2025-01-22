import styled from 'styled-components'
import { forwardRef } from 'react'

const NewebpayFormContainer = styled.div`
  h1 {
    text-align: center;
    font-size: 36px;
  }

  button {
    display: none;
  }
`

/**
 * @typedef Props
 * @property {string} props.merchantId
 * @property {string} props.tradeInfo
 * @property {string} props.tradeSha
 * @property {string} props.version
 * @property {string} props.newebpayApiUrl
 */

/**
 * @type {import('react').ForwardRefRenderFunction<HTMLInputElement, Props>}
 */
const Form = (
  {
    merchantId = '',
    tradeInfo = '',
    tradeSha = '',
    version = '',
    newebpayApiUrl = 'https://ccore.newebpay.com/MPG/mpg_gateway',
  },
  inputRef
) => {
  return (
    <NewebpayFormContainer>
      <form id="data_set" name="newebpay" method="post" action={newebpayApiUrl}>
        <input
          type="hidden"
          name="MerchantID"
          value={merchantId}
          ref={inputRef}
        />
        <input type="hidden" name="TradeInfo" value={tradeInfo} />
        <input type="hidden" name="TradeSha" value={tradeSha} />
        <input type="hidden" name="Version" value={version} />

        <button>Submit</button>
      </form>
    </NewebpayFormContainer>
  )
}

const NewebpayForm = forwardRef(Form)

export default NewebpayForm
