//TODO: replace <a> with <Link> for Single Page Application

import styled from 'styled-components'
import Image from 'next/image'
import { SUB_BRAND_LINKS, PROMOTION_LINKS } from '../constants'
import SubBrandList from './sub-brand-list'
import SearchBar from './search-bar'
import PromotionLinks from './promotion-links'
import NavSections from './nav-sections'
import FlashNews from './flash-news'
import NavTopics from './nav-topics'
import SubscribeMagazine from './subscribe-magazine'
import React from 'react'

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
  height: 74.62px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 90px 20px;
  border-bottom: 3px solid black;
  .logo {
    cursor: pointer;
  }
`
const ActionWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  z-index: 529;
`
const HeaderNav = styled.nav``
const NavBottom = styled.div`
  display: flex;
`
/**
 * Remove item from array `categories` if which is member only category.
 * @param {Section} section
 * @returns {Section}
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
 * @typedef {Object} BasicInfo - info of certain category/section/topic
 * @property {string} _id - id
 * @property {string} title - chinese name of category/section/topic
 * @property {string} name - english name of category/section/topic
 */

/**
 * @typedef {Object} CategoryType
 * @property {boolean} isMemberOnly - whether this category belongs to the members area
 *
 * @typedef {BasicInfo & CategoryType} Category
 */

/**
 * @typedef {Object} SectionType
 * @property {boolean} isFeatured - if true, should be selected and render
 * @property {Category[]} categories - categories which belong to certain section
 *
 * @typedef {BasicInfo & SectionType} Section
 */

/**
 * @typedef {BasicInfo & {isFeatured: boolean} } Topic
 */

/**
 * @param {Object} props
 * @param {Section[]} props.sectionsData
 * @param {Topic[]} props.topicsData
 * @returns {React.ReactElement}
 */
export default function Header({ sectionsData = [], topicsData = [] }) {
  const sections =
    sectionsData
      .filter((section) => section.isFeatured)
      .map(filterOutIsMemberOnlyCategoriesInNormalSection) ?? []
  const topics =
    topicsData.filter((topic) => topic.isFeatured).slice(0, 7) ?? []

  return (
    <HeaderWrapper>
      <HeaderTop>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">
          <Image
            className="logo"
            src="/images/mirror-media-logo.svg"
            alt="mirrormedia"
            width={107}
            height={45}
          ></Image>
        </a>
        <ActionWrapper>
          <SubBrandList subBrands={SUB_BRAND_LINKS} />
          <SearchBar />
          <PromotionLinks links={PROMOTION_LINKS} />
        </ActionWrapper>
      </HeaderTop>
      <HeaderNav>
        <NavSections sections={sections} />
        <FlashNews flashNews={MOCK_DATA_FLASH_NEWS} />
        <NavBottom>
          <NavTopics topics={topics} />
          <SubscribeMagazine />
        </NavBottom>
      </HeaderNav>
    </HeaderWrapper>
  )
}
