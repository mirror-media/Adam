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

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 32px;
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
        鏡週刊訂閱制上線，讓有價的閱聽成就更多優質文章，並獻上無廣告的閱讀環境，讓您盡情享受15類會員專屬內容，誠摯邀請您
        <Link href={href}>立即加入</Link>。
      </p>
    </Wrapper>
  )
}
