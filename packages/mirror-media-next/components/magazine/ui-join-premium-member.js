import styled from 'styled-components'
import SubscribeLink from '../../components/story/shared/subscribe-link'
import { PRIZE_LIST } from '../../constants/subscribe-constants'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 65vh;
`

const InfoWrapper = styled.div`
  padding: 0 20px;
  width: 100%;
  margin-top: 24px;
  margin-bottom: 36px;

  ${({ theme }) => theme.breakpoint.md} {
    width: 680px;
    padding: 0;
    margin-top: 47.46px;
    margin-bottom: 205px;
  }
`

const Title = styled.h1`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
  line-height: 150%;
  margin-bottom: 16px;
`

const Subtitle = styled.h2`
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-weight: 400;
  line-height: 200%;
  margin-bottom: 24px;
`

const Box = styled.div`
  width: 100%;
  display: flex;
  padding: 24px 16px 16px;
  flex-direction: column;
  align-items: center;

  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08),
    0px 4px 28px 0px rgba(0, 0, 0, 0.06);

  ${({ theme }) => theme.breakpoint.md} {
    width: 680px;
    padding: 24px;
  }

  .textL {
    text-align: center;
    color: rgba(0, 0, 0, 0.87);
    font-size: 18px;
    font-weight: 500;
    line-height: 150%;
  }

  .textS {
    text-align: center;
    color: rgba(0, 0, 0, 0.5);
    font-size: 14px;
    font-weight: 400;
    line-height: 150%;
    margin-bottom: 12px;
  }

  .subscribe-btn {
    width: 100%;
    min-height: 75px;
    border-radius: 12px;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    letter-spacing: 1px;

    ${({ theme }) => theme.breakpoint.md} {
      width: 480px;
    }
  }
`

export default function JoinPremiumMember() {
  return (
    <Wrapper>
      <InfoWrapper>
        <Title>動態雜誌</Title>
        <Subtitle>加入 premium 會員，免費閱覽最新電子版週刊</Subtitle>
        <Box>
          <p className="textL">準備好升級為鏡週刊 Premium 會員了嗎？</p>
          <p className="textS">
            每月 ${PRIZE_LIST.monthly} 元，暢享專區零廣告閱讀、優質報導看到飽
          </p>
          <SubscribeLink className="subscribe-btn" />
        </Box>
      </InfoWrapper>
    </Wrapper>
  )
}
