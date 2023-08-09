//TODOs:
//1. set login feature
//2. set logout feature

import { useState, useRef, useContext } from 'react'
import Image from 'next/legacy/image'
import styled from 'styled-components'
import useClickOutside from '../../../hooks/useClickOutside'
import { RedirectUrlContext } from '../../../context/redirectUrl'

const MemberLoginButtonWrapper = styled.div`
  margin-left: 15px;
`
const LoginButton = styled.span`
  font-size: 13px;
  line-height: 150%;
  text-decoration: underline;
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
  cursor: pointer;
`

export default function MemberLoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSelectOptions, setShowSelectOptions] = useState(false)
  const selectWrapperRef = useRef(null)
  const redirectUrl = useContext(RedirectUrlContext)

  const dropdownMenuItem = [
    { title: '個人資料', href: `${redirectUrl}/profile` },
    { title: '訂閱紀錄', href: `${redirectUrl}/profile/purchase` },
  ]

  useClickOutside(selectWrapperRef, () => {
    setShowSelectOptions(false)
  })

  const handleLogOut = () => {
    setShowSelectOptions(false)
    setIsLoggedIn((val) => !val)
  }
  const handleLogIn = () => {
    setIsLoggedIn((val) => !val)
  }
  let memberLoginButton
  if (isLoggedIn) {
    memberLoginButton = (
      <LoggedInWrapper>
        <Image
          src="/images/membership-member-icon-logged-in.svg"
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
    memberLoginButton = <LoginButton onClick={handleLogIn}>登入</LoginButton>
  }
  return (
    <MemberLoginButtonWrapper ref={selectWrapperRef}>
      {memberLoginButton}
    </MemberLoginButtonWrapper>
  )
}
