import styled from 'styled-components'
import DonateLink from './donate-link'

const Container = styled.div`
  margin: 32px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 60px;
  background: #ffffff;
  box-shadow: 0px 4px 28px rgba(0, 0, 0, 0.06), 0px 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 24px;

  .title {
    color: white;
    margin-bottom: 12px;
    font-weight: 500;
    font-size: 18px;
    line-height: 150%;
    color: rgba(0, 0, 0, 0.87);
    text-align: center;
  }

  .desc {
    margin-bottom: 12px;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 200%;
    color: rgba(0, 0, 0, 0.5);
    text-align: center;
  }

  .banner-button {
    width: 100%;
    height: 70px;
    padding: 20px;
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
export default function SupportSingleArticleBanner({ className }) {
  return (
    <Container className={className}>
      <p className="title">小心意大意義，小額贊助鏡週刊！</p>
      {/* <p className="desc">目前已有 123,456 人贊助本文</p> */}
      <DonateLink className="banner-button GTM-donate-link-bottom" />
    </Container>
  )
}
