//REMINDER: DO NOT REMOVE className which has prefix `GTM-`, since it is used for collecting data of Google Analytics event.

import { useState, useRef } from 'react'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import useClickOutside from '../hooks/useClickOutside'
import Link from 'next/link'
import { useMembership, logout } from '../context/membership'
import { useAppDispatch } from '../hooks/useRedux'
import { loginActions } from '../slice/login-slice'
const MemberLoginButtonWrapper = styled.div`
  margin-left: 23px;

  ${({ theme }) => theme.breakpoint.xl} {
    margin-left: 16px;
  }
`
const LoginButton = styled.button`
  font-size: 14px;
  line-height: 150%;
  text-decoration: underline;
  text-underline-offset: 2.5px;
  color: #000;

  &:focus {
    outline: none;
  }
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
  cursor: pointer;
`
const dropdownMenuItem = [
  { title: '個人資料', href: '/profile' },
  { title: '訂閱紀錄', href: '/profile/purchase' },
]

export default function MemberLoginButton() {
  const { isLoggedIn } = useMembership()
  const router = useRouter()

  const [showSelectOptions, setShowSelectOptions] = useState(false)
  const selectWrapperRef = useRef(null)
  const dispatch = useAppDispatch()

  useClickOutside(selectWrapperRef, () => {
    setShowSelectOptions(false)
  })

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
          className="GTM-header-login"
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
      <LoginButton>
        <Link
          href={`/login?destination=${router.asPath || '/'}`}
          className="GTM-header-login"
        >
          <span>登入</span>
        </Link>
      </LoginButton>
    )
  }
  return (
    <MemberLoginButtonWrapper ref={selectWrapperRef}>
      {memberLoginButton}
    </MemberLoginButtonWrapper>
  )
}
