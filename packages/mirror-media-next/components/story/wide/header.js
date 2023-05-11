import { useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import LogoSvg from '../../../public/images/mirror-media-logo.svg'
import HamburgerButton from '../../shared/hamburger-button'
import CloseButton from '../../shared/close-button'
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
  color: red;
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

const SideBar = styled.section`
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 0;

  width: 100%;
  height: 100%;
  background-color: #3e3e3e;
  font-size: 14px;
  line-height: 1.5;
  z-index: 539;
  overflow-y: auto;
  right: 0;
  transform: ${
    /** @param {{shouldShowSidebar: Boolean}} props */
    ({ shouldShowSidebar }) =>
      shouldShowSidebar ? 'translateX(0)' : 'translateX(100%)'
  };

  transition: transform 0.5s ease-in-out;

  ${({ theme }) => theme.breakpoint.md} {
    width: 320px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

export default function Header() {
  const [shouldOpenSideBar, setShouldOpenSideBar] = useState(false)
  return (
    <HeaderWrapper>
      <Link href="/">
        <LogoSvg></LogoSvg>
      </Link>
      <HamburgerButton
        color="lightBlue"
        handleOnClick={() => setShouldOpenSideBar((val) => !val)}
      />

      <SideBar shouldShowSidebar={shouldOpenSideBar}>
        <CloseButton
          handleOnClick={() => setShouldOpenSideBar((val) => !val)}
        />
      </SideBar>
    </HeaderWrapper>
  )
}
