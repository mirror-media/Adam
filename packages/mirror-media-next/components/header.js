//REMINDER: DO NOT REMOVE className which has prefix `GTM-`, since it is used for collecting data of Google Analytics event.
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  SUB_BRAND_LINKS,
  PROMOTION_LINKS,
  SOCIAL_MEDIA_LINKS,
} from '../constants'
import { DEFAULT_NORMAL_SECTIONS_DATA } from '../constants/header'

import SubBrandList from './sub-brand-list'
import SearchBarDesktop from './search-bar-desktop'
import PromotionLinks from './promotion-links'
import NavSections from './nav-sections'
import MemberLoginButton from './member-login-button'
import SearchBarInput from './search-bar-input'
import MobileSidebar from './mobile-sidebar'
import Logo from './logo'
import SubscribeMagazine from './subscribe-magazine'
import NavTopics from './nav-topics'
import { SEARCH_URL } from '../config/index.mjs'

import { useDisplayAd } from '../hooks/useDisplayAd'

const GPTAd = dynamic(() => import('../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

/**
 * @typedef {import('./nav-sections').HeadersDataSection} HeadersDataSection
 * @typedef {import('./nav-sections').HeadersDataCategory} HeadersDataCategory
 * @typedef {import('./nav-sections').HeadersDataCategoryWithHref} HeadersDataCategoryWithHref
 * @typedef {import('./nav-sections').HeadersDataSectionWithHref} HeadersDataSectionWithHref
 * @typedef {import('./nav-sections').SectionsAndCategoriesWithHref} SectionsAndCategoriesWithHref
 */

/**
 * @typedef {import('./nav-topics').Topics} Topics
 */

const HeaderWrapper = styled.header`
  background-color: rgba(255, 255, 255, 1);
  margin: 0 auto;
`
const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 21px 15px 20px 8px;
  max-width: 596px;
  margin: 0 auto;
  height: 75px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 21px 0px 20px 0;
    height: 69.24px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    border-bottom: 3px solid black;
    padding: 21px 90px 20px;
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
  display: none;
  ${({ theme }) => theme.breakpoint.md} {
    display: block;
    width: 68px;
    height: 29px;
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

const TopicsAndFlashNews = styled.section`
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 10px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 0px;
  }
`
const TopicsAndSubscribe = styled.section`
  display: flex;
`

const StyledGPTAd = styled(GPTAd)`
  width: 100%;
  height: auto;
  max-width: 110px;
  max-height: 50px;
  margin-right: auto;
  ${({ theme }) => theme.breakpoint.md} {
    order: -1;
    margin-right: 0;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin-left: 20px;
    margin-right: auto;
    order: 0;
  }
`

const formatSectionItem = (section) => {
  const sectionWithInsertedCategory = insertCategoryIntoCertainSection(section)
  const sectionAndItsCategoriesWithHref = getSectionAndCategoryHref(
    sectionWithInsertedCategory
  )
  return sectionAndItsCategoriesWithHref

  /**
   * @param {HeadersDataSection} section
   * @returns {HeadersDataSection}
   */
  function insertCategoryIntoCertainSection(section) {
    if (section.slug === 'member') {
      return {
        ...section,
        categories: [
          {
            id: '7a7482edb739242537f11e24760d2c79', //hash for ensure it is unique from other category, no other usage.
            slug: 'magazine',
            name: '動態雜誌',
            isMemberOnly: false,
          },
          ...section.categories,
        ],
      }
    } else if (section.slug === 'life') {
      return {
        ...section,
        categories: [
          ...section.categories,
          {
            id: '306dac073da6dc1ddb4e34c228035915', //hash for ensure it is unique from other category, no other usage.
            slug: 'warmlife',
            name: '暖流',
            isMemberOnly: false,
          },
        ],
      }
    }
    return { ...section }
  }
  /**
   * @param {HeadersDataSection} section
   * @returns {HeadersDataSectionWithHref}
   */
  function getSectionAndCategoryHref(section) {
    return {
      ...section,
      href: getSectionHref(section.slug),
      categories: getCategoryInSectionWithHref(section),
    }

    /**
     * @param {HeadersDataSection['slug']} sectionSlug
     * @returns {HeadersDataCategoryWithHref['href']}
     */
    function getSectionHref(sectionSlug) {
      if (sectionSlug === 'member') {
        return `/premiumsection/${sectionSlug}`
      } else {
        return `/section/${sectionSlug}`
      }
    }

    /**
     * @param {HeadersDataSection} section
     * @returns {HeadersDataSectionWithHref['categories']}
     */
    function getCategoryInSectionWithHref(section) {
      const { categories = [] } = section
      return categories.map((category) => {
        return {
          ...category,
          href: getCategoryHref(section.slug, category.slug),
        }
      })
      /**
       * @param {HeadersDataSection['slug']} sectionSlug
       * @param {import('./nav-sections').CategoryInHeadersDataSection['slug']} categorySlug
       * @returns {string}
       */
      function getCategoryHref(sectionSlug, categorySlug) {
        if (sectionSlug === 'videohub') {
          return `/video_category/${categorySlug}`
        }
        if (categorySlug === 'magazine') {
          return '/magazine/'
        }
        if (sectionSlug === 'life' && categorySlug === 'warmlife') {
          return '/externals/warmlife'
        }
        return `/category/${categorySlug}`
      }
    }
  }
}

const formatCategoryItem = (category) => {
  return getSectionAndCategoryHref(category)

  /**
   *
   * @param {HeadersDataCategory} section
   * @return {HeadersDataCategoryWithHref}
   */
  function getSectionAndCategoryHref(section) {
    return {
      ...section,
      href: getCategoryHref(section.sections, section.slug),
    }

    /**
     *
     * @param {HeadersDataCategory['sections']} sections
     * @param {HeadersDataCategory['slug']} categorySlug
     * @returns {string}
     */
    function getCategoryHref(sections, categorySlug) {
      if (
        sections &&
        sections.length &&
        sections.some((section) => section === 'videohub')
      ) {
        return `/video_category/${categorySlug}`
      }
      return `/category/${categorySlug}`
    }
  }
}
/**
 *
 * @param {(HeadersDataSection | HeadersDataCategory)[] } sectionsData
 * @returns {SectionsAndCategoriesWithHref}
 */
const formatSections = (sectionsData) => {
  const _sectionsData =
    sectionsData && sectionsData.length
      ? sectionsData
      : DEFAULT_NORMAL_SECTIONS_DATA
  const formattedSectionData = _sectionsData.map((item) => {
    switch (item.type) {
      case 'section':
        return formatSectionItem(item)
      case 'category':
        return formatCategoryItem(item)
      default:
        return null
    }
  })

  return formattedSectionData
}
/**
 * TODO: use typedef in `../apollo/fragments/section` and  `../apollo/fragments/topic`
 * Should be done after fetch header data from new json file
 * @param {Object} props
 * @param {SectionsAndCategoriesWithHref} props.sectionsData
 * @param {Topics} props.topicsData
 * @param {JSX.Element} [props.children]
 * @returns {React.ReactElement}
 */
export default function Header({
  sectionsData = [],
  topicsData = [],
  children = null,
}) {
  const sections = formatSections(sectionsData)
  const topics = topicsData && topicsData.length ? topicsData.slice(0, 9) : []
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
    location.assign(`${SEARCH_URL}/search/v3/${trimedSearchTerms}`)
  }

  const shouldShowAd = useDisplayAd()

  return (
    <HeaderWrapper>
      <HeaderTop>
        <Link href="/" className="GTM-header-logo">
          <HeaderLogo />
        </Link>
        {shouldShowAd && <StyledGPTAd pageKey="global" adKey="RWD_LOGO" />}
        <ActionWrapper>
          <SubBrandList subBrands={SUB_BRAND_LINKS} />
          <SearchBarDesktop
            searchTerms={searchTerms}
            setSearchTerms={setSearchTerms}
            goSearch={goSearch}
          />
          <SearchButtonMobile ref={mobileSearchButtonRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images-next/search-button-mobile.svg"
              alt="search-button"
            />
          </SearchButtonMobile>
          <MemberLoginButton />
          <PromotionLinks links={PROMOTION_LINKS} />
          <MobileSidebar
            topics={topics}
            sectionsAndCategories={sections}
            subBrands={SUB_BRAND_LINKS}
            promotions={PROMOTION_LINKS}
            socialMedia={SOCIAL_MEDIA_LINKS}
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
        <NavSections sectionsAndCategories={sections} />
        <TopicsAndFlashNews>
          {children}
          <TopicsAndSubscribe>
            <NavTopics topics={topics} />
            <SubscribeMagazine />
          </TopicsAndSubscribe>
        </TopicsAndFlashNews>
      </HeaderBottom>
    </HeaderWrapper>
  )
}
const SkeletonHeaderTop = styled(HeaderTop)`
  border-color: transparent;
`
const SkeletonBlock = styled.div`
  background-color: rgba(239, 239, 239, 1);
  width: ${
    /**
     *
     * @param {Object} param
     * @param {{width: string, height:string}} [param.mobile]
     * @param {{width: string, height:string}} [param.tablet]
     * @param {{width: string, height:string}} [param.desktop]
     */
    ({ mobile }) => (mobile.width ? mobile.width : '105px')
  };
  height: ${({ mobile }) => (mobile.height ? mobile.height : '32px')};
  ${({ theme }) => theme.breakpoint.md} {
    width: ${({ tablet }) => (tablet.width ? tablet.width : '105px')};
    height: ${({ tablet }) => (tablet.height ? tablet.height : '32px')};
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: ${({ desktop }) => (desktop.width ? desktop.width : '105px')};
    height: ${({ desktop }) => (desktop.height ? desktop.height : '32px')};
  }
`

const SkeletonBottomUp = styled.div`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
`

const SkeletonBlockBottomDown = styled(SkeletonBlock)`
  margin-bottom: 18px;

  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 18px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 0px;
  }
`
const HeaderSkeleton = () => {
  const elementInBottomUp = []
  const numberOfElementsInBottomUp = 10

  for (let i = 0; i < numberOfElementsInBottomUp; i++) {
    elementInBottomUp.push(
      <SkeletonBlock
        key={i}
        mobile={{ width: '90px', height: '32px' }}
        tablet={{ width: '90px', height: '32px' }}
        desktop={{ width: '90px', height: '32px' }}
      />
    )
  }

  return (
    <HeaderWrapper>
      <SkeletonHeaderTop>
        <SkeletonBlock
          mobile={{ width: '78px', height: '50px' }}
          tablet={{ width: '94px', height: '50px' }}
          desktop={{ width: '105px', height: '36px' }}
        />
        <SkeletonBlock
          mobile={{ width: '94px', height: '24px' }}
          tablet={{ width: '94px', height: '24px' }}
          desktop={{ width: '435px', height: '26px' }}
        />
      </SkeletonHeaderTop>
      <HeaderBottom>
        <SkeletonBottomUp>{elementInBottomUp}</SkeletonBottomUp>
        <SkeletonBlockBottomDown
          mobile={{ width: '100%', height: '20px' }}
          tablet={{ width: '100%', height: '20px' }}
          desktop={{ width: '100%', height: '29px' }}
        />
      </HeaderBottom>
    </HeaderWrapper>
  )
}

export { HeaderSkeleton }
