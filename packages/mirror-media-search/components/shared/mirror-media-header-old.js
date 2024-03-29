import { useEffect, useState, useRef, useContext } from 'react'
import styled from 'styled-components'

import EventLogo from './event-logo'
import SearchBar from './search-bar'

import { maxWidth, minWidth } from '../../styles/media'
import {
  Header_Search_Margin_Right,
  Header_Top_Layer_Width,
  Logo_Wrapper_Margin_X,
  Menu_Icon_Width,
  Search_Icon_Width,
} from '../../styles/header'
import hamburgerWhite from '../../public/images/hamburger-white.png'
import SubscribeMagazine from './subscribe-magazine'
import PromotionLinks from './promotion-links'
import NavSections from './nav-sections'
import {
  SUB_BRAND_LINKS,
  PROMOTION_LINKS,
  SOCIAL_MEDIA_LINKS,
} from '../../utils/mirror-media/const'
import { mediaSize } from '../../styles/media'
import NavTopics from './nav-topics'
import MobileSidebar from './mobile-sidebar'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import { RedirectUrlContext } from '../../context/redirectUrl'

const HeaderWrapper = styled.header`
  background-color: #204f74;
  z-index: 519;
  @media ${maxWidth.xl} {
    position: sticky;
    top: 0;
  }
  @media ${minWidth.xl} {
    height: 160px;
  }
`

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${Header_Top_Layer_Width};
  max-width: 1024px;
  height: 71px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 33px;
  padding-bottom: 13px;
  @media ${minWidth.md} {
    padding-top: 0px;
    padding-bottom: 0;
  }
  @media ${minWidth.xl} {
    height: 70px;
  }
`

const MenuIcon = styled.button`
  flex-shrink: 0;
  width: ${Menu_Icon_Width};
  height: 10px;
  background-image: url(${hamburgerWhite.src});
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  user-select: none;
  @media ${minWidth.xl} {
    display: none;
  }
`

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(
    100% -
      (${Menu_Icon_Width} + ${Search_Icon_Width} + ${Logo_Wrapper_Margin_X} * 2)
  );
  @media ${minWidth.xl} {
    justify-content: flex-start;
    width: auto;
  }
`
const Logo = styled.a`
  cursor: pointer;
  user-select: none;
`
const LogoIcon = styled.img`
  width: 74px;
  @media ${minWidth.xl} {
    width: auto;
    height: 50px;
  }
`
const GpqAd = styled.div``

const ActionWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  z-index: 529;
  ${({ fixHeader }) =>
    fixHeader && `margin-right: ${Header_Search_Margin_Right};`}
  @media ${maxWidth.xl} {
    flex-direction: row-reverse;
  }
`

const HeaderNav = styled.nav``

function filterOutIsMemberOnlyCategoriesInNormalSection(section) {
  return {
    ...section,
    categories:
      section.name === 'member'
        ? section.categories
        : section.categories.filter((category) => !category.isMemberOnly),
  }
}

export default function OldHeader({ sectionsData, topicsData }) {
  const [showSidebar, setShowSidebar] = useState(false)
  const [fixHeader, setFixHeader] = useState(false)
  const headerRef = useRef(null)
  const redirectUrl = useContext(RedirectUrlContext)
  const { width } = useWindowDimensions()

  useEffect(() => {
    function handleFixHeader() {
      const shouldFix = window.scrollY >= headerRef.current.offsetHeight
      setFixHeader(shouldFix)
    }

    if (headerRef.current) {
      if (width < mediaSize.xl) {
        window.addEventListener('scroll', handleFixHeader)
        handleFixHeader()
      } else {
        window.removeEventListener('scroll', handleFixHeader)
        setFixHeader(false)
      }
    }
    return () => {
      window.removeEventListener('scroll', handleFixHeader)
    }
  }, [width])

  const sections =
    sectionsData
      .filter((section) => section.isFeatured)
      .map(filterOutIsMemberOnlyCategoriesInNormalSection) ?? []
  const topics =
    topicsData.filter((topic) => topic.isFeatured).slice(0, 7) ?? []

  return (
    <HeaderWrapper ref={headerRef}>
      <HeaderTop>
        <MenuIcon
          onClick={() => {
            setShowSidebar(true)
          }}
        />
        <LogoWrapper>
          <Logo href={`${redirectUrl}/`}>
            <LogoIcon src="/images/mirror-media-logo.svg" />
          </Logo>
          <EventLogo />
          <GpqAd />
        </LogoWrapper>
        <ActionWrapper fixHeader={fixHeader}>
          <SearchBar />
          <SubscribeMagazine />
          <PromotionLinks links={PROMOTION_LINKS} />
        </ActionWrapper>
      </HeaderTop>
      {!fixHeader && (
        <HeaderNav>
          <NavSections sections={sections} />
          <NavTopics topics={topics} subBrands={SUB_BRAND_LINKS} />
        </HeaderNav>
      )}
      {showSidebar && (
        <MobileSidebar
          topics={topics}
          sections={sections}
          subBrands={SUB_BRAND_LINKS}
          promotions={PROMOTION_LINKS}
          socialMedias={SOCIAL_MEDIA_LINKS}
          closeSidebar={() => {
            setShowSidebar(false)
          }}
        />
      )}
    </HeaderWrapper>
  )
}
