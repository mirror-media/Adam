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

const PlanWrapper = styled.div`
  margin: 0 auto;
  max-width: 468px;
`

export default function PlanForMonthlyMember() {
  return (
    <>
      <Page>
        <PlanWrapper>
          <PremiumCard
            planTitle="變更為年訂閱方案"
            shouldHideMonthlyButton={true}
          />
        </PlanWrapper>
      </Page>
      <Notification />
    </>
  )
}
