//TODO: after login system is added, should check logged in state and link to different page based on logged in state.

import styled from 'styled-components'
import Link from 'next/link'

import { IS_ANNIVERSARY_PROMO_ACTIVE } from '../../../config/index.mjs'
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
    margin: 0 4px;
    color: rgba(234, 193, 81, 1);
    font-weight: 600;
    border-bottom: 1px solid rgba(234, 193, 81, 1);
  }
`

export default function SubscribeInviteBanner() {
  // TODO: 周年慶完結後要移除
  if (IS_ANNIVERSARY_PROMO_ACTIVE) return null

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
        鏡週刊掌握趨勢，領先一步：從國際大事到生活小確幸，我們確保您不錯過任何一個重要瞬間，誠摯邀請您
        <Link href={href}>立即加入閱讀</Link>。
      </p>
    </Wrapper>
  )
}
