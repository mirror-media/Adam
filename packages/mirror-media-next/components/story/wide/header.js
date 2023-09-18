import { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import useClickOutside from '../../../hooks/useClickOutside'

import LogoSvg from '../../../public/images-next/mirror-media-logo.svg'
import HamburgerButton from '../../shared/hamburger-button'
import CloseButton from '../../shared/close-button'
import NavSubtitleNavigator from '../shared/nav-subtitle-navigator'
import ButtonSocialNetworkShare from '../shared/button-social-network-share'
import ButtonCopyLink from '../shared/button-copy-link'
/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

const HeaderWrapper = styled.header`
  position: fixed;
  pointer-events: none;
  z-index: 499;
  width: 100%;
  padding: 12px 12px 0 12px;
  margin: 0 auto;
  top: 0;
  left: 0;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  > * {
    pointer-events: initial;
  }
  svg {
    path {
      fill: ${
        /**
         * @param {Object} param
         * @param {Theme} [param.theme]
         */
        ({ theme }) => theme.color.brandColor.lightBlue
      };
    }
  }
`
const SocialMedia = styled.li`
  display: flex;
  margin-bottom: 24px;
  padding-left: 24px;
  padding-right: 24px;
  a {
    margin-right: 10px;
  }
`
const SideBarModal = styled.section`
  position: fixed;
  top: 0;

  width: 100%;
  height: 100%;
  background-color: transparent;
  font-size: 14px;
  line-height: 1.5;
  z-index: 539;
  overflow-y: auto;
  right: 0;
  ${
    /**
     * @param {{shouldShowSidebar: Boolean}} props
     */
    ({ shouldShowSidebar }) =>
      shouldShowSidebar
        ? 'transform: translateX(0%)'
        : 'transform: translateX(100%)'
  };
  overflow-x: hidden;
  transition: transform 0.5s ease-in-out;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const SideBar = styled.section`
  width: 100%;
  height: 100%;
  background-color: #3e3e3e;
  margin-left: auto;
  ${({ theme }) => theme.breakpoint.md} {
    width: 320px;
  }
`

export default function Header({ h2AndH3Block = [] }) {
  const sideBarRef = useRef(null)
  const [shouldOpenSideBar, setShouldOpenSideBar] = useState(false)
  useClickOutside(sideBarRef, () => {
    setShouldOpenSideBar(false)
  })
  // While the sidebar is open, disable body scroll.
  useEffect(() => {
    const sideBar = sideBarRef.current
    if (!sideBar) {
      return
    }
    if (shouldOpenSideBar) {
      disableBodyScroll(sideBar)
      return () => enableBodyScroll(sideBar)
    } else {
      return undefined
    }
  }, [shouldOpenSideBar])

  return (
    <HeaderWrapper>
      <Link href="/">
        <LogoSvg></LogoSvg>
      </Link>
      <HamburgerButton
        color="lightBlue"
        handleOnClick={() => setShouldOpenSideBar((val) => !val)}
      />
      <SideBarModal shouldShowSidebar={shouldOpenSideBar}>
        <SideBar ref={sideBarRef}>
          <CloseButton
            handleOnClick={() => setShouldOpenSideBar((val) => !val)}
          />
          <NavSubtitleNavigator
            h2AndH3Block={h2AndH3Block}
            componentStyle="side-bar"
            handleCloseSideBar={() => setShouldOpenSideBar(false)}
          />
          <SocialMedia>
            <ButtonSocialNetworkShare type="facebook" width={28} height={28} />
            <ButtonSocialNetworkShare type="line" width={28} height={28} />
            <ButtonCopyLink width={28} height={28} />
          </SocialMedia>
        </SideBar>
      </SideBarModal>
    </HeaderWrapper>
  )
}
