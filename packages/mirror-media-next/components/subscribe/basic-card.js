import styled from 'styled-components'
import { BASIC_FEATURES } from '../../constants/subscribe-constants'
import Check from './check-icon'
import SecondaryBlueBtn from './secondary-blue-btn'

const PlanCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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

const PlanTitle = styled.h3`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
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

const BtnWrapper = styled.div`
  margin-top: auto;

  .join-member-btn {
    height: 72px;
  }
`

export default function BasicCard() {
  return (
    <PlanCard>
      <PlanTitle>Basic 會員</PlanTitle>

      <FeaturesList>
        {BASIC_FEATURES.map((feature, index) => (
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
        <SecondaryBlueBtn
          title="加入會員"
          href="/login?destination=%2Fsubscribe"
          className="join-member-btn"
        />
      </BtnWrapper>
    </PlanCard>
  )
}
