import styled from 'styled-components'
import PremiumCard from './premium-card'
import BasicCard from './basic-card'
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

  ${({ theme }) => theme.breakpoint.xl} {
    width: 960px;
  }
`

const CardsWrapper = styled.div`
  display: grid;
  grid-row-gap: 16px;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 24px;
  }
`

export default function PlansForNonMember() {
  return (
    <>
      <Page>
        <PlanWrapper>
          <SectionTitle>方案選擇</SectionTitle>
          <CardsWrapper>
            <PremiumCard />
            <BasicCard />
          </CardsWrapper>
        </PlanWrapper>
      </Page>
      <Notification />
    </>
  )
}
