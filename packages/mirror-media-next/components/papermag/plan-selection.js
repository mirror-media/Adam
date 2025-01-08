import styled from 'styled-components'
import SubscribePlanBtn from '../subscribe-plan-btn'

const Body = styled.section`
  padding: 24px 0;
`

const PlansWrapper = styled.ul`
  display: grid;
  width: 90%;
  margin: 0 auto;
  grid-row-gap: 12px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 24px 0;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 24px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    width: 960px;
  }
`

const PlanCard = styled.li`
  padding: 24px 16px;
  text-align: center;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0px 4px 28px 0px rgba(0, 0, 0, 0.06),
    0px 2px 12px 0px rgba(0, 0, 0, 0.08);

  ${({ theme }) => theme.breakpoint.md} {
    padding: 24px 24px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 24px 24px;
    width: 468px;
  }
`
const PlanTitle = styled.h2`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 32px;
  }
`
const Hr = styled.hr`
  margin: 16px 0;
`

const PlanContent = styled.p`
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 12px;
`
const OriginalPrice = styled.p`
  color: rgba(0, 0, 0, 0.3);
  font-size: 18px;
  font-weight: 500;
  text-decoration: line-through;
  margin-bottom: 4px;
`
const SpecialPrice = styled.p`
  color: #e51731;
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 12px;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 32px;
  }
`

export default function PageBody() {
  return (
    <Body>
      <PlansWrapper>
        <PlanCard>
          <PlanTitle>一年方案</PlanTitle>
          <Hr />
          <PlanContent>訂購紙本鏡週刊 52 期，加贈 5 期</PlanContent>
          <OriginalPrice>原價 3,900</OriginalPrice>
          <SpecialPrice>特價 2,880</SpecialPrice>
          <SubscribePlanBtn
            title="訂購一年方案"
            subtitle="續訂另有優惠"
            bgColor="#1D9FB8"
            hoverColor="#054F77"
            hoverText="#fff"
            href="/papermag/1"
          />
        </PlanCard>

        <PlanCard>
          <PlanTitle>二年方案</PlanTitle>
          <Hr />
          <PlanContent>訂購紙本鏡週刊 104 期，加贈 10 期</PlanContent>
          <OriginalPrice>原價 7,800</OriginalPrice>
          <SpecialPrice>特價 5,280</SpecialPrice>
          <SubscribePlanBtn
            title="訂購二年方案"
            subtitle="續訂另有優惠"
            bgColor="#054F77"
            hoverColor="#9CB7C6"
            hoverText="#000"
            href="/papermag/2"
          />
        </PlanCard>
      </PlansWrapper>
    </Body>
  )
}
