import styled from 'styled-components'
import PremiumCard from './premium-card'
import Notification from './subscribe-notification'

const Page = styled.section`
  background-color: rgba(0, 0, 0, 0.05);
  padding: 24px 20px 48px 20px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 48px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 60px 120px;
  }
`

const SectionTitle = styled.h2`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 24px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 32px;
  }
`

const PlanWrapper = styled.div`
  margin: 0 auto;
  max-width: 468px;
`

export default function PlanForBasicMember() {
  return (
    <>
      <Page>
        <PlanWrapper>
          <SectionTitle>方案選擇</SectionTitle>
          <PremiumCard />
        </PlanWrapper>
      </Page>
      <Notification />
    </>
  )
}
