import styled from 'styled-components'
import BlankCard from './blank-card'
import PrimaryBlueBtn from './primary-blue-btn'

const PageWrapper = styled.section`
  min-height: 70vh;
  padding: 40px 20px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 48px;
    background-color: rgba(0, 0, 0, 0.05);
  }
`
const Title = styled.h2`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 12px;
`
const Text = styled.div`
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-weight: 400;
  span {
    color: #054f77;
  }
`

export default function PlanForYearlyMember() {
  return (
    <PageWrapper>
      <BlankCard>
        <Title>想要變更方案嗎？</Title>
        <Text>
          您目前訂閱的方案為<span>鏡週刊 Premium 服務-年訂閱方案</span>
          。如需變更，請先取消目前的方案，再重新訂閱新的方案。
        </Text>
        <PrimaryBlueBtn title="前往付款設定" href="/subscribe/set" />
      </BlankCard>
    </PageWrapper>
  )
}
