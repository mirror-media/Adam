import styled from 'styled-components'
import DonateLink from './donate-link'
const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.87);
  padding: 32px;
  display: flex;
  flex-direction: column;
  color: white;
  font-size: 18px;
  line-height: 1.5;
  margin-top: 60px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 32px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    color: white;
  }
`
const DonateLinkInBanner = styled(DonateLink)`
  border: 1px solid white;
  height: 43px;
  width: 100%;
  padding: 8px 16px 8px 18px;
  font-size: 18px;
  line-height: 1.5;
  margin: 10px 0;
  color: white;
  img {
    width: 20px;
    height: 20px;
  }
  ${({ theme }) => theme.breakpoint.md} {
    margin: 6px 0;
    width: 140px;
  }
`

export default function DonateBanner() {
  return (
    <Container>
      <p className="title">小心意大意義，小額贊助鏡週刊！</p>

      <DonateLinkInBanner />
    </Container>
  )
}
