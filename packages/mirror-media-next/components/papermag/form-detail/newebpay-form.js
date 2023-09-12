import styled from 'styled-components'

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
 * @param {Object} props
 * @param {string} props.merchantId
 * @param {string} props.tradeInfo
 * @param {string} props.tradeSha
 * @param {string} props.version
 * @param {string} props.newebpayApiUrl
 * @returns {JSX.Element}
 */
export default function NewebpayForm({
  merchantId = '',
  tradeInfo = '',
  tradeSha = '',
  version = '',
  newebpayApiUrl = 'https://ccore.newebpay.com/MPG/mpg_gateway',
}) {
  return (
    <NewebpayFormContainer>
      <form id="data_set" name="newebpay" method="post" action={newebpayApiUrl}>
        <input type="hidden" name="MerchantID" value={merchantId} />
        <input type="hidden" name="TradeInfo" value={tradeInfo} />
        <input type="hidden" name="TradeSha" value={tradeSha} />
        <input type="hidden" name="Version" value={version} />

        <button>Submit</button>
      </form>
    </NewebpayFormContainer>
  )
}
