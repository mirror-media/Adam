import Link from 'next/link'
import styled from 'styled-components'
const Wrapper = styled.div`
  width: 100%;
  background-color: #ffffff;
  padding: 20px 44px 28px;
  color: ${({ theme }) => theme.color.brandColor.darkBlue};
  font-size: 20px;
  line-height: 1.4;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  gap: 20px;
  p {
    width: 188px;
  }
  a {
    color: #ffffff;
    background-color: ${({ theme }) => theme.color.brandColor.lightBlue};
    margin: auto;
    padding: 8px 48px;
  }
  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: row;
    justify-content: space-between;
    padding: 0;
    p {
      width: fit-content;
      text-align: left;
    }
    a {
      margin: 0;
    }
  }
`
/**
 *
 * @param {Object} props
 * @param {string} [props.className] - Attribute for updating style by styled-component
 * @returns {JSX.Element}
 */
export default function MagazineInviteBanner({ className }) {
  return (
    <Wrapper className={className}>
      <p>月費、年費會員免費線上閱讀動態雜誌</p>
      <Link href="/magazine" target="_blank">
        線上閱讀
      </Link>
    </Wrapper>
  )
}
