import styled from 'styled-components'
import SubscribePlanBtn from '../subscribe-plan-btn'
import { PREMIUM_FEATURES } from '../../constants/subscribe-constants'
import Badge from './badge-icon'
import Check from './check-icon'

const PlanCard = styled.div`
  position: relative;
  padding: 24px 16px 16px;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0px 4px 28px 0px rgba(0, 0, 0, 0.06),
    0px 2px 12px 0px rgba(0, 0, 0, 0.08);

  ${({ theme }) => theme.breakpoint.xl} {
    padding: 24px;
    width: 468px;
  }
`

const BadgeWrapper = styled.div`
  width: 48px;
  border-radius: 0 24px 0 0;
  overflow: hidden;
  position: absolute;
  top: -1px;
  right: -1px;
`

const PlanTitle = styled.h3`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
`

const BtnWrapper = styled.div`
  display: grid;
  grid-gap: 12px;
  gap: 12px;
  margin-top: 24px;
`

const FeaturesList = styled.ul`
  margin-top: 24px;
`

const Feature = styled.li`
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  display: flex;
  p {
    margin-left: 4px;
  }
`

const Hr = styled.hr`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 12px 0;
`

// const DiscountMsg = styled.div`
//   color: #054f77;
//   font-size: 14px;
// `

/**
 * @param {Object} props
 * @param {string} [props.planTitle='Premium 會員'] - The title of the subscription plan.
 * @param {boolean} [props.shouldHideMonthlyButton=false] - Whether to hide the monthly subscription button.
 * @returns {JSX.Element}
 */
export default function PremiumCard({
  planTitle = 'Premium 會員',
  shouldHideMonthlyButton = false,
}) {
  return (
    <PlanCard>
      <BadgeWrapper>
        <Badge />
      </BadgeWrapper>
      <PlanTitle>{planTitle}</PlanTitle>
      <FeaturesList>
        {PREMIUM_FEATURES.map((feature, index) => (
          <div key={index}>
            <Feature>
              <Check />
              <p>{feature}</p>
            </Feature>
            <Hr />
          </div>
        ))}
      </FeaturesList>

      <BtnWrapper>
        <SubscribePlanBtn
          title="訂購年方案"
          subtitle="優惠 $499 元"
          bgColor="#054F77"
          hoverColor="#9CB7C6"
          hoverText="#000"
          href="/subscribe/info?plan=yearly"
        />
        {!shouldHideMonthlyButton && (
          <SubscribePlanBtn
            title="訂購月方案"
            subtitle="優惠 $49 元"
            bgColor="#1D9FB8"
            hoverColor="#054F77"
            hoverText="#fff"
            href="/subscribe/info?plan=monthly"
          />
        )}
      </BtnWrapper>
    </PlanCard>
  )
}
