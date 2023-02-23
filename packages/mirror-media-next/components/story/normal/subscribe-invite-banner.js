//TODO: after login system is added, should check logged in state and link to different page based on logged in state.

import styled from 'styled-components'
import Link from 'next/link'
const Wrapper = styled.div`
  margin-top: 16px;
  padding: 32px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.87);
  color: white;
  font-size: 18px;
  line-height: 2;
  font-weight: 400;
  border: 3px solid ${({ theme }) => theme.color.brandColor.darkBlue};
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 32px;
    border: none;
  }
  a {
    color: rgba(234, 193, 81, 1);
    font-weight: 600;
    border-bottom: 1px solid rgba(234, 193, 81, 1);
  }
`

export default function SubscribeInviteBanner() {
  const getHref = (isLoggedIn) => {
    if (isLoggedIn) {
      return '/subscribe'
    } else {
      return '/login/?destination=/subscribe'
    }
  }
  const href = getHref(false)
  return (
    <Wrapper>
      <p>
        鏡週刊4年了，讀者的建議與批評我們都虛心聆聽。為提供讀者最好的閱讀空間，我們成立了會員區，提供會員高質量、無廣告、一文到底的純淨閱讀體驗，邀您
        <Link href={href}>立即體驗</Link>。
      </p>
    </Wrapper>
  )
}
