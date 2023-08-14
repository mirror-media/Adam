import styled from 'styled-components'
import Checkbox from './checkbox-input'

const Wrapper = styled.div`
  margin-top: 24px;
`

const TermsAndConditions = styled.p`
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  font-weight: 400;
  margin-top: 12px;
  padding-left: 28px;
`
const Notes = styled.p`
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  font-weight: 400;
  margin: 48px 0 24px;
`

export default function AcceptingTermsAndConditions({
  isAcceptedConditions,
  setIsAcceptedConditions,
}) {
  const handleAcceptingConditions = () => {
    setIsAcceptedConditions(!isAcceptedConditions)
  }

  return (
    <Wrapper>
      <Checkbox
        checked={isAcceptedConditions}
        onChange={handleAcceptingConditions}
        label="我已閱讀並同意："
      />
      <TermsAndConditions>
        鏡週刊於行銷目的範圍內得永久彙集。處理及利用本人填寫之訂單資料，並得利用前述資料而為本公司在台灣地區對本人發送活動、服務訊息。本公司對所彙集資料依法保密。本人如有請求停止彙集、處理、利用之需要可書面或致電訂戶組處理
        (02) 6636-6800。
      </TermsAndConditions>
      <Notes>
        按下開始結帳後，頁面將會跳離，抵達由藍新金流 NewebPay
        所提供的線上結帳頁面，完成後將會再跳回到鏡週刊
      </Notes>
    </Wrapper>
  )
}
