import styled from 'styled-components'
import SubscribePlanBtn from '../subscribe-plan-btn'
import { useMemo } from 'react'

const Page = styled.section`
  background-color: rgba(0, 0, 0, 0.05);
  padding: 24px 0;
`
const Announcement = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: linear-gradient(
      0deg,
      rgba(229, 23, 49, 0.05) 0%,
      rgba(229, 23, 49, 0.05) 100%
    ),
    #fff;
  width: 90%;
  margin: 0 auto 24px;

  ${({ theme }) => theme.breakpoint.md} {
    margin: 0 auto;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    width: 960px;
  }

  .announce-title {
    color: #e51731;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .announce-text {
    color: rgba(0, 0, 0, 0.66);
    font-size: 14px;
    font-weight: 400;
  }
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

function Plan() {
  const shouldShowAnnouncement = useMemo(() => {
    const startUtc = new Date(Date.UTC(2024, 2, 19, 16))
    const endUtc = new Date(Date.UTC(2024, 3, 8, 16))
    const nowUtc = new Date(Date.now())

    // 2024/3/20 ~ 4/9
    return nowUtc > startUtc && nowUtc < endUtc
  }, [])
  return (
    <Page>
      {!!shouldShowAnnouncement && (
        <Announcement>
          <p className="announce-title">[4月份訂戶派送異動公告]</p>
          <p className="announce-text">預祝清明佳節愉快！</p>
          <p className="announce-text">
            因逢清明連續假期，392期(4/3出刊)的雜誌最晚4/8(一)完成配送，造成困擾敬請見諒。
          </p>
        </Announcement>
      )}
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
    </Page>
  )
}

export default Plan
