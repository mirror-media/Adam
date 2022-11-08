//TODO: replace <a> with <Link> from Nextjs for Single Page Application

import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {
  SUB_BRAND_LINKS,
  PROMOTION_LINKS,
  SOCIAL_MEDIA_LINKS,
} from '../constants'

import SubBrandList from './sub-brand-list'
import SearchBarDesktop from './search-bar-desktop'
import PromotionLinks from './promotion-links'
import NavSections from './nav-sections'
import FlashNews from './flash-news'
import NavTopics from './nav-topics'
import SubscribeMagazine from './subscribe-magazine'
import GptAd from './gpt-ad.js'
import MemberLoginButton from './member-login-button'
import SearchBarInput from './search-bar-input'
import MobileSidebar from './mobile-sidebar'
import Logo from './logo'
const MOCK_DATA_FLASH_NEWS = [
  {
    slug: 'premium-test',
    title: 'premium-test',
    href: '/story/premium-test/',
  },
  {
    slug: '20180120soc001',
    title: '【吸金父子檔】這對父子太誇張　詐騙逾2億還「感謝上帝帶你進來」',
    href: '/story/20180120soc001/',
  },
  {
    slug: 'no-image',
    title: '沒有首圖的會員文章-aa',
    href: '/story/no-image/',
  },
  {
    slug: 'test-story-slug',
    title: 'Lighthouse 測試用文章',
    href: '/story/test-story-slug/',
  },
  {
    slug: '20191028ent006',
    title: '【網紅星勢力】唱歌拉二胡還不夠　許貝貝、小黛比陪聊留人',
    href: '/story/20191028ent006/',
  },
  {
    slug: '20201118fin001_test',
    title: '【理財最前線】捷運年底上路　台中北屯熱區買房攻略',
    href: '/story/20201118fin001_test/',
  },
  {
    slug: '20191125ent004',
    title: '【網紅星勢力】模特兒當到見血　J寶金嗓召喚陳零九',
    href: '/story/20191125ent004/',
  },
  {
    slug: 'oscar-test',
    title:
      '【奧斯卡90】完整得獎名單　《水底情深》奪4大獎：最佳影片、最佳導演、最佳原創配樂及最佳藝術指導',
    href: '/story/oscar-test/',
  },
  {
    slug: 'testvideotitle2',
    title: '測試影片與標題新格式',
    href: '/story/testvideotitle2/',
  },
  {
    slug: '20180129ent007',
    title: '【搶鏡頭】潔西卡瞎忙　那裡沒露還遮',
    href: '/story/20180129ent007/',
  },
]

const HeaderWrapper = styled.div`
  background-color: rgba(255, 255, 255, 1);
  max-width: 1200px;
  margin: 0 auto;
`
const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 21px 8px 20px;
  border-bottom: 3px solid black;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 21px 90px 20px;
  }
  .logo {
    cursor: pointer;
  }
`

const HeaderLogo = styled(Logo)`
  display: none;
  ${({ theme }) => theme.breakpoint.md} {
    display: block;
    width: 49px;
    height: 20.72px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
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
  ${
    /**
     * @param {{showSearchField:boolean}} props
     */ ({ showSearchField }) =>
      showSearchField ? 'height: 60px;' : 'height: 0px;'
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

const NavBottom = styled.div`
  display: flex;
`
/**
 * Remove item from array `categories` if which is member only category.
 * @param {import('../type').Section} section
 * @returns {import('../type').Section}
 */
function filterOutIsMemberOnlyCategoriesInNormalSection(section) {
  return {
    ...section,
    categories:
      section.name === 'member'
        ? section.categories
        : section.categories.filter((category) => !category.isMemberOnly),
  }
}

/**
 * @param {Object} props
 * @param {import('../type').Section[]} props.sectionsData
 * @param {import('../type').Topic[]} props.topicsData
 * @returns {React.ReactElement}
 */
export default function Header({ sectionsData = [], topicsData = [] }) {
  const [showSearchField, setShowSearchField] = useState(false)
  const [searchTerms, setSearchTerms] = useState('')
  const mobileSearchButtonRef = useRef(null)
  const mobileSearchWrapperRef = useRef(null)

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
    location.assign(`/search/${trimedSearchTerms}`)
  }

  const sections =
    sectionsData
      .filter((section) => section.isFeatured)
      .map(filterOutIsMemberOnlyCategoriesInNormalSection) ?? []

  const topics =
    topicsData.filter((topic) => topic.isFeatured).slice(0, 9) ?? []

  return (
    <HeaderWrapper>
      <HeaderTop>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">
          <HeaderLogo />
        </a>
        <GptAd />
        <ActionWrapper>
          <SubBrandList subBrands={SUB_BRAND_LINKS} />
          <SearchBarDesktop
            searchTerms={searchTerms}
            setSearchTerms={setSearchTerms}
            goSearch={goSearch}
          />
          <SearchButtonMobile ref={mobileSearchButtonRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/search-button-mobile.svg" alt="search-button" />
          </SearchButtonMobile>
          <MemberLoginButton />
          <PromotionLinks links={PROMOTION_LINKS} />
          <MobileSidebar
            topics={topics}
            sections={sections}
            subBrands={SUB_BRAND_LINKS}
            promotions={PROMOTION_LINKS}
            socialMedia={SOCIAL_MEDIA_LINKS}
          />
        </ActionWrapper>
      </HeaderTop>
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

      <nav>
        <NavSections sections={sections} />
        <FlashNews flashNews={MOCK_DATA_FLASH_NEWS} />
        <NavBottom>
          <NavTopics topics={topics} />
          <SubscribeMagazine />
        </NavBottom>
      </nav>
    </HeaderWrapper>
  )
}
