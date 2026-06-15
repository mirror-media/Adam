// 勿刪！保留此元件供每年春節使用

import styled from 'styled-components'

const NoticeWrapperWrapper = styled.section`
  width: 100%;
  padding: 12px;

  ${({ theme }) => theme.breakpoint.xl} {
    padding-top: 24px;
    padding-bottom: 0px;
    display: flex;
    justify-content: center;
  }
`

const NoticeWrapper = styled.section`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background:
    linear-gradient(
      0deg,
      rgba(229, 23, 49, 0.05) 0%,
      rgba(229, 23, 49, 0.05) 100%
    ),
    #fff;

  ${({ theme }) => theme.breakpoint.xl} {
    width: 1020px;
  }
`

const Title = styled.h5`
  color: #e51731;
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
  margin-bottom: 8px;
`

const Content = styled.p`
  text-align: justify;
  color: rgba(0, 0, 0, 0.66);
  text-align: justify;
  font-size: 14px;
  line-height: 150%;
`

export default function LunarNewYearNotice() {
  return (
    <NoticeWrapperWrapper>
      <NoticeWrapper>
        <Title>[2月份訂戶派送異動公告]</Title>
        <Content>預祝新春如意！造成困擾敬請見諒。</Content>
        <Content>第489期(原2/11)提前於2/10出刊，2/12完成配送。</Content>
        <Content>
          第490期(原2/18)提前於2/14出刊，因逢春節期間延至2/23起配送。
        </Content>
      </NoticeWrapper>
    </NoticeWrapperWrapper>
  )
}
