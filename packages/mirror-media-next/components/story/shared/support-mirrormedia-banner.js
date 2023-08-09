import styled from 'styled-components'
import DonateLink from './donate-link'
import SubscribeLink from './subscribe-link'

const Container = styled.div`
  margin: 32px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(90deg, #61b8c6 0%, #054f77 100%);
  box-shadow: 0px 4px 28px rgba(0, 0, 0, 0.06), 0px 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 24px;

  .title {
    color: white;
    font-family: 'PingFang TC';
    font-weight: 600;
    font-size: 24px;
    line-height: 200%;
    margin-bottom: 8px;
  }
`

const InnerWrapper = styled.div`
  display: grid;
  grid-template-rows: auto;
  gap: 12px;
  grid-gap: 12px;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: 1fr 1fr;
  }
`

const InnerBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;

  .desc {
    font-family: 'PingFang TC';
    font-weight: 400;
    font-size: 18px;
    line-height: 150%;
    text-align: center;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px;
  }

  .banner-button {
    width: 100%;
    height: 70px;
    padding: 20px;
    font-family: 'PingFang TC';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    text-align: center;
    color: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 24px;
    flex: none;
    flex-grow: 0;
    img {
      width: 20px;
      height: 20px;
    }
  }
`

/**
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export default function SupportMirrorMediaBanner({ className }) {
  return (
    <Container className={className}>
      <p className="title">支持鏡週刊</p>
      <InnerWrapper>
        <InnerBox>
          <p className="desc">小心意大意義，小額贊助鏡週刊！</p>
          <DonateLink className="banner-button GTM-donate-link-bottom" />
        </InnerBox>
        <InnerBox>
          <p className="desc">每月 $49 元全站看到飽，暢享無廣告閱讀體驗</p>
          <SubscribeLink className="banner-button GTM-subscribe-link-bottom" />
        </InnerBox>
      </InnerWrapper>
    </Container>
  )
}
