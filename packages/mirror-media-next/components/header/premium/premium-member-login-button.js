//TODOs:
//1. set login feature
//2. set logout feature

import { useState, useRef } from 'react'
import Image from 'next/legacy/image'
import styled from 'styled-components'
import useClickOutside from '../../../hooks/useClickOutside'
import { useRouter } from 'next/router'
import { useMembership, logout } from '../../../context/membership'
import { useAppDispatch } from '../../../hooks/useRedux'
import { loginActions } from '../../../slice/login-slice'
import { getLoginHref } from '../../../utils'
import Link from 'next/link'

const MemberLoginButtonWrapper = styled.div`
  cursor: pointer;
`

const LoginButton = styled(Link)`
  font-size: 13px;
  line-height: 150%;
  color: #000;
  padding-left: 1px;
`
const LoggedInWrapper = styled.div`
  position: relative;
  display: flex;
  align-self: center;
`

const DropdownMenu = styled.div`
  position: absolute;
  left: -40px;
  top: 40px;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  box-sizing: border-box;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 120px;
  z-index: 99999;
  font-size: 13px;
  color: #888888;
`
const DropdownMenuItem = styled.a`
  display: block;
  width: 100%;
  padding: 24px 0;
  text-align: center;
  border-bottom: 1px solid #d8d8d8;
`

const DesktopWrapper = styled.span`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: inline-block;
  }
`

const MobileWrapper = styled.span`
  font-size: 14px;
  display: inline-block;
  transform: scale(calc(10 / 12));
  text-decoration-line: underline;
  text-underline-offset: 2.5px;
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const dropdownMenuItem = [
  { title: '個人資料', href: '/profile' },
  { title: '訂閱紀錄', href: '/profile/purchase' },
]

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @returns {React.ReactElement}
 */
export default function PremiumMemberLoginButton({ className }) {
  const [showSelectOptions, setShowSelectOptions] = useState(false)
  const selectWrapperRef = useRef(null)
  useClickOutside(selectWrapperRef, () => {
    setShowSelectOptions(false)
  })
  const router = useRouter()
  const { isLoggedIn } = useMembership()
  const dispatch = useAppDispatch()
  const handleLogOut = () => {
    setShowSelectOptions(false)
    dispatch(loginActions.resetLoginState())
    logout()
  }

  let memberLoginButton
  if (isLoggedIn) {
    memberLoginButton = (
      <LoggedInWrapper>
        <Image
          src="/images-next/membership-member-icon-logged-in.svg"
          alt="member-icon-logged-in"
          width={25.67}
          height={30.81}
          onClick={() => setShowSelectOptions((val) => !val)}
        ></Image>

        {showSelectOptions && (
          <DropdownMenu>
            {dropdownMenuItem.map((item) => (
              <DropdownMenuItem key={item.title} href={item.href}>
                {item.title}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={handleLogOut}>登出</DropdownMenuItem>
          </DropdownMenu>
        )}
      </LoggedInWrapper>
    )
  } else {
    memberLoginButton = (
      <LoginButton href={getLoginHref(router)}>
        <DesktopWrapper>註冊/登入</DesktopWrapper>
        <MobileWrapper>登入</MobileWrapper>
      </LoginButton>
    )
  }
  return (
    <MemberLoginButtonWrapper ref={selectWrapperRef} className={className}>
      {memberLoginButton}
    </MemberLoginButtonWrapper>
  )
}
