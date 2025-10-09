import styled from 'styled-components'
import SubscribePlanBtn from '../subscribe-plan-btn'
import { PLAN } from '../../constants/papermag'
import { getPlanInfoByIdAndShouldFreight } from '../../utils/papermag'
import { getNumberWithCommas } from '../../utils'
import Image from 'next/image'
import PlanBannerImg from '../../public/images-next/papermag/plan-banner.jpg'
import Link from 'next/link'

const PlansWrapper = styled.section`
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  row-gap: 12px;

  ${({ theme }) => theme.breakpoint.xl} {
    width: 1020px;
    padding: 48px 0;
  }
`

const DesktopLayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;

  ${({ theme }) => theme.breakpoint.xl} {
    display: flex;
    flex-direction: row;
    column-gap: 60px;
    row-gap: 24px;
    flex-wrap: wrap;
  }
`

const LeftColumnWrapper = styled.div`
  ${({ theme }) => theme.breakpoint.xl} {
    flex: 0 0 478px;
  }
`

const RightColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;

  ${({ theme }) => theme.breakpoint.xl} {
    flex: 1;
    row-gap: 24px;
  }
`

const PlanBanner = styled(Image)`
  width: 100%;
  height: 100%;
`

const PlanCard = styled.div`
  padding: 24px 16px 16px 16px;
  text-align: center;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0px 4px 28px 0px rgba(0, 0, 0, 0.06),
    0px 2px 12px 0px rgba(0, 0, 0, 0.08);

  ${({ theme }) => theme.breakpoint.xl} {
    width: 468px;
    padding: 16px;
  }
`

const PlanCTA = styled.div`
  border-radius: 20px;
  border: 1px solid #054f77;
  padding: 24px 16px 16px 16px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  row-gap: 10px;
  font-size: 18px;
  font-weight: 500;
  color: #054f77;
  line-height: 150%;

  ${({ theme }) => theme.breakpoint.xl} {
    width: 468px;
    padding: 16px 24px;
    flex-direction: row;
    justify-content: space-between;
  }
`
const CtaText = styled.p`
  width: 100%;

  ${({ theme }) => theme.breakpoint.xl} {
    width: auto;
  }
`
const CtaBtn = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #054f77;
  background-color: white;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
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

/** @param {import('../../constants/papermag').PlanEnum} plan */
const getPlanHref = (plan) => `/papermag/${plan}`

const ONE_YEAR_ITEM = getPlanInfoByIdAndShouldFreight(PLAN.ONE_YEAR, false)
const TWO_YEAR_ITEM = getPlanInfoByIdAndShouldFreight(PLAN.TWO_YEAR, false)
const ITEMS = [
  {
    id: PLAN.ONE_YEAR,
    title: '一年方案',
    context: `訂購紙本鏡週刊 ${ONE_YEAR_ITEM.issue} 期，加贈 ${ONE_YEAR_ITEM.discount.issue} 期`,
    basePrice: ONE_YEAR_ITEM.basePrice,
    price: ONE_YEAR_ITEM.price,
    button: {
      title: '訂購一年方案',
      bgColor: '#1D9FB8',
      hoverColor: '#054F77',
      hoverText: '#fff',
      href: getPlanHref(PLAN.ONE_YEAR),
    },
  },
  {
    id: PLAN.TWO_YEAR,
    title: '二年方案',
    context: `訂購紙本鏡週刊 ${TWO_YEAR_ITEM.issue} 期，加贈 ${TWO_YEAR_ITEM.discount.issue} 期`,
    basePrice: TWO_YEAR_ITEM.basePrice,
    price: TWO_YEAR_ITEM.price,
    button: {
      title: '訂購二年方案',
      bgColor: '#054F77',
      hoverColor: '#9CB7C6',
      hoverText: '#000',
      href: getPlanHref(PLAN.TWO_YEAR),
    },
  },
]

export default function PageBody() {
  return (
    <>
      <PlansWrapper>
        <DesktopLayoutWrapper>
          <LeftColumnWrapper>
            <PlanBanner src={PlanBannerImg} alt="文宣" priority />
          </LeftColumnWrapper>
          <RightColumnWrapper>
            {ITEMS.map((item) => (
              <PlanCard key={item.id}>
                <PlanTitle>{item.title}</PlanTitle>
                <Hr />
                <PlanContent>{item.context}</PlanContent>
                <OriginalPrice>
                  原價 {getNumberWithCommas(item.basePrice)}
                </OriginalPrice>
                <SpecialPrice>
                  特價 {getNumberWithCommas(item.price)}
                </SpecialPrice>
                <SubscribePlanBtn
                  title={item.button.title}
                  subtitle="續訂另有優惠"
                  bgColor={item.button.bgColor}
                  hoverColor={item.button.hoverColor}
                  hoverText={item.button.hoverText}
                  href={item.button.href}
                />
              </PlanCard>
            ))}
            <PlanCTA>
              <CtaText>師生優惠方案、企業訂閱優惠</CtaText>
              <Link
                href="mailto:service@mirrormedia.mg"
                target="_blank"
                rel="noreferrer noopener"
              >
                <CtaBtn>聯絡我們</CtaBtn>
              </Link>
            </PlanCTA>
          </RightColumnWrapper>
        </DesktopLayoutWrapper>
      </PlansWrapper>
    </>
  )
}
