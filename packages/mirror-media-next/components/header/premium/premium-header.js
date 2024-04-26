import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

import SearchBarDesktop from '../shared/search-bar-desktop'
import { Z_INDEX } from '../../../constants'
import { DEFAULT_PREMIUM_SECTIONS_DATA } from '../../../constants/header'
import SearchBarInput from '../shared/search-bar-input'
import Logo from '../normal/logo'
import PremiumMobileSidebar from './premium-mobile-sidebar'
import PremiumNavSections from './premium-nav-sections'
import PremiumMemberLoginButton from './premium-member-login-button'
import { SEARCH_URL } from '../../../config/index.mjs'

/**
 * @typedef {import('./premium-mobile-sidebar').H2AndH3Block} H2AndH3Block
 */
const HeaderWrapper = styled.header`
  background-color: rgba(255, 255, 255, 1);
  margin: 0 auto;
  ${
    /**
     * @param {Object} param
     * @param {boolean} param.shouldSticky
     */
    ({ shouldSticky }) =>
      shouldSticky &&
      `position: sticky;
    z-index: ${Z_INDEX.header};
    top: 0;`
  }
`
const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 29px 12px 14px 11px;
  max-width: 596px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 23px 0px 13.3px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    border-bottom: 3px solid black;
    padding: 12px 88px 13.7px 91px;
    max-width: 1200px;
  }
`
const HeaderBottom = styled.div`
  max-width: 596px;
  margin: 0 auto;
  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 1024px;
  }
`
const HeaderLogo = styled(Logo)`
  display: block;
  width: 87px;
  height: 37px;
  ${({ theme }) => theme.breakpoint.md} {
    width: 84px;
    height: 35px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 107px;
    height: 45px;
  }
`

const ActionWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  z-index: 529;
`
const SearchButtonMobile = styled.button`
  display: block;
  width: 16px;
  &:focus {
    border: none;
    outline: none;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`
const SearchInputMobile = styled(SearchBarInput)`
  width: 100%;
  border: unset;
  margin: auto 15px;
  input {
    background-color: white;
    &::placeholder {
      color: rgba(188, 188, 188, 1);
    }
  }
`

const SearchInputWrapper = styled.div`
  background-color: #f5f5f5;
  display: flex;
  align-content: center;
  text-align: center;
  margin-top: -6px;
  ${
    /**
     * @param {{showSearchField:boolean}} props
     */ ({ showSearchField }) =>
      showSearchField ? 'height: 60px;' : 'height: 0px;'
  }
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 2px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }

  transition: height 0.5s ease-out;
  ${SearchInputMobile} {
    ${
      /**
       * @param {{showSearchField:boolean}} props
       */ ({ showSearchField }) =>
        showSearchField ? 'display:block' : 'display:none'
    }
  }
`

const DesktopPremiumMemberLoginButton = styled(PremiumMemberLoginButton)`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    text-decoration: none;
    > a {
      display: inline-flex;
      padding: 5px 8px;
      background-color: #054f77;
      border-radius: 38px;
    }
    span {
      color: #fff;
      font-size: 14px;
    }
  }
`
const MobilePremiumMemberLoginButton = styled(PremiumMemberLoginButton)`
  display: block;
  margin-left: 15px;
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

/**
 *
 * @typedef {import('../../../apollo/fragments/section').Section[]} PremiumHeaderSections
 *
 * @typedef PremiumHeaderData
 * @property {PremiumHeaderSections} sections
 */

/**
 * @param {Object} props
 * @param {PremiumHeaderData} props.premiumHeaderData
 * @param {boolean} [props.shouldShowSubtitleNavigator]
 * @param {H2AndH3Block[]} [props.h2AndH3Block]
 * @returns {React.ReactElement}
 */
export default function PremiumHeader({
  premiumHeaderData,
  shouldShowSubtitleNavigator = false,
  h2AndH3Block = [],
}) {
  const [showSearchField, setShowSearchField] = useState(false)
  const [searchTerms, setSearchTerms] = useState('')
  const mobileSearchButtonRef = useRef(null)
  const mobileSearchWrapperRef = useRef(null)
  const getSections = () => {
    if (
      premiumHeaderData &&
      premiumHeaderData.sections &&
      premiumHeaderData.sections.length
    ) {
      return premiumHeaderData.sections
    } else {
      return DEFAULT_PREMIUM_SECTIONS_DATA
    }
  }
  // If user click search button, will show/hide search field search input field.
  // If user click outside of search input field, or outside of search button, will hide  search field if needed.
  useEffect(() => {
    const handleSearchFieldOpen = (/** @type {MouseEvent}*/ event) => {
      if (
        mobileSearchButtonRef.current &&
        mobileSearchButtonRef.current.contains(event.target)
      ) {
        setShowSearchField((val) => !val)
      } else if (
        mobileSearchWrapperRef.current &&
        !mobileSearchWrapperRef.current.contains(event.target)
      ) {
        setShowSearchField(false)
      }
    }
    document.addEventListener('click', handleSearchFieldOpen, true)
    return () => {
      document.removeEventListener('click', handleSearchFieldOpen, true)
    }
  }, [mobileSearchButtonRef, mobileSearchWrapperRef, setShowSearchField])

  const goSearch = () => {
    /*
      1. remove whitespace from both sides of a string
      2. remove whitespace from both sides of any comma
      3. replace whitespace bwtween two letters with a comma
     */
    const trimedSearchTerms = searchTerms
      .trim()
      .replace(/\s*,\s*/g, ',')
      .replace(/\s+/g, ',')

    if (trimedSearchTerms === '') return setSearchTerms('')
    location.assign(`${SEARCH_URL}/search/v3/${trimedSearchTerms}`)
  }

  const sections = getSections()

  return (
    <HeaderWrapper
      shouldSticky={shouldShowSubtitleNavigator}
      className="header header-premium"
    >
      <HeaderTop>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">
          <HeaderLogo />
        </a>
        <ActionWrapper>
          <SearchBarDesktop
            searchTerms={searchTerms}
            setSearchTerms={setSearchTerms}
            goSearch={goSearch}
          />
          <SearchButtonMobile
            aria-label="search-button"
            ref={mobileSearchButtonRef}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images-next/search-button-mobile.svg"
              alt="search-button"
            />
          </SearchButtonMobile>
          <MobilePremiumMemberLoginButton />
          <PremiumMobileSidebar
            sections={sections}
            shouldShowSubtitleNavigator={shouldShowSubtitleNavigator}
            h2AndH3Block={h2AndH3Block}
          />
        </ActionWrapper>
      </HeaderTop>
      <HeaderBottom>
        <SearchInputWrapper
          showSearchField={showSearchField}
          ref={mobileSearchWrapperRef}
        >
          <SearchInputMobile
            value={searchTerms}
            onChange={
              /** @param {React.ChangeEvent<HTMLInputElement>} event */
              (event) => {
                setSearchTerms(event.target.value)
              }
            }
            onKeyPress={
              /** @param {React.KeyboardEvent} e */
              (e) => {
                if (e.key === 'Enter') {
                  goSearch()
                }
              }
            }
          />
        </SearchInputWrapper>
        <PremiumNavSections sections={sections}>
          <DesktopPremiumMemberLoginButton />
        </PremiumNavSections>
      </HeaderBottom>
    </HeaderWrapper>
  )
}
