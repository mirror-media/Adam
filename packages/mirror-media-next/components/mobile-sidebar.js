import styled, { css } from 'styled-components'
import React, { Fragment, useState, useRef } from 'react'
import useClickOutside from '../hooks/useClickOutside'
import Link from 'next/link'
import HamburgerButton from './shared/hamburger-button'
import CloseButton from './shared/close-button'

/**
 * @typedef {import('../apollo/fragments/section').Section} Section
 */

/**
 * @typedef {import('../apollo/fragments/section').SectionWithCategory} SectionWithCategory
 */

/**
 * @typedef {Omit<Section, 'categories' > & {href: string, categories: Array.<SectionWithCategory & { href: string }> }} SectionWithHrefTemp
 */
/**
 * @typedef {Pick<import('../apollo/fragments/topic').Topic, 'id' | 'slug' | 'name'>[]} Topics
 */

/**
 * @typedef {import('../type/theme').Theme} Theme
 */

const colorCss = css`
  ${
    /**
     * @param {Object} param
     * @param {string} [param.sectionSlug]
     * @param {Theme} [param.theme]
     */
    ({ sectionSlug, theme }) => {
      if (sectionSlug === 'member') {
        return '#e51731'
      } else if (sectionSlug && theme.color.sectionsColor[sectionSlug]) {
        return theme.color.sectionsColor[sectionSlug]
      } else {
        return '#fff'
      }
    }
  };
`

const SideBar = styled.section`
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #054f77;
  font-size: 14px;
  line-height: 1.5;
  z-index: 539;
  overflow-y: auto;
  left: ${
    /** @param {{shouldShowSidebar: Boolean}} props */
    ({ shouldShowSidebar }) => (shouldShowSidebar ? '0' : '-100%')
  };
  transition: left 0.5s ease-in-out;

  ${({ theme }) => theme.breakpoint.md} {
    width: 320px;
    left: ${({ shouldShowSidebar }) => (shouldShowSidebar ? '0' : '-100%')};
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const Topics = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-right: 19px;
`
const Topic = styled.a`
  font-weight: 500;
  color: #fff;
  text-decoration: underline;
`
const Section = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  color: #fff;
  font-weight: 700;
  position: relative;
  padding: 12px 0 12px 20px;
  border-bottom: 1px solid #fff;
  &::before,
  ::after {
    display: block;
    position: absolute;
    content: '';
  }
  &::before {
    top: 14px;
    left: 0;
    width: 8px;
    height: 16px;
    background-color: ${
      /**
       * @param {Object} param
       * @param {string} [param.sectionSlug]
       */
      ({ sectionSlug }) => (sectionSlug ? colorCss : '#fff')
    };
  }
`

const SectionToggle = styled.button`
  width: 25%;
  height: 1rem;
  display: block;
  &:focus {
    outline: none;
  }
  &:after {
    position: absolute;
    width: 0;
    height: 0;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    content: '';
    border-style: solid;
    border-width: 6px 10.4px 6px 0;
    border-color: transparent #fff transparent transparent;
    border-width: ${
      /**
       * @param {Object} props
       * @param {Boolean} props.shouldOpen
       */
      ({ shouldOpen }) => (shouldOpen ? '10.4px 6px 0 6px' : '6px 10.4px 6px 0')
    };
    border-color: ${({ shouldOpen }) =>
      shouldOpen
        ? '#fff transparent transparent transparent'
        : 'transparent #fff transparent transparent'};
  }
`
const Categories = styled.div`
  display: flex;
  font-weight: 400;
  flex-wrap: wrap;
  gap: 4px 12px;
  color: ${
    /**
     * @param {Object} param
     * @param {string} [param.sectionSlug]
     * @param {boolean} [param.shouldShowCategories]
     */
    ({ sectionSlug }) => (sectionSlug ? colorCss : '#fff')
  };

  margin-top: ${({ shouldShowCategories }) =>
    shouldShowCategories ? '12px' : '0px'};
  gap: ${({ shouldShowCategories }) =>
    shouldShowCategories ? '4px 12px' : '0px'};
  transition: all 0.5s ease-in-out;

  a {
    height: ${({ shouldShowCategories }) =>
      shouldShowCategories ? '21px' : '0'};
    visibility: ${({ shouldShowCategories }) =>
      shouldShowCategories ? 'visible' : 'hidden'};
    opacity: ${({ shouldShowCategories }) =>
      shouldShowCategories ? '1' : '0'};
    transition: all 0.5s ease-in-out;
  }
`
const SideBarTop = styled.div`
  padding: 24px;
`
const SideBarBottom = styled(SideBarTop)`
  margin-top: auto;
`
const SubBrandList = styled.ul`
  display: flex;
  justify-content: space-between;
  margin-bottom: 45px;
  img {
    height: 19px;
  }
`
const PromotionList = styled.ul`
  color: #bcbcbc;
  justify-content: center;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex-wrap: wrap;
  row-gap: 9px;
`
// The way to display social-media link is copied from mirror-media-nuxt,
// should be refactor if has separate image of each social media.
const SocialMediaList = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background-color: #333333;
  padding: 4.5px 24px;
  img {
    width: 20px;
    height: 20px;
    background-image: url(/images/social-media-white@2x.png);
    display: block;
    background-size: 126px 120px;
    &.line {
      background-position: -86px -80px;
    }
    &.weibo {
      background-position: -66px -60px;
    }
    &.facebook {
      background-position: -106px -100px;
    }
    &.instagram {
      background-position: -46px -40px;
    }
    &.rss {
      background-position: -26px -20px;
    }
    &.email {
      width: 26px;
      background-position: 0 0;
    }
  }
`
/**
 * TODO: use typedef in `../apollo/fragments/section`
 * Should be done after fetch header data from new json file
 * @param {Object} props
 * @param {Topics} props.topics
 * @param {SectionWithHrefTemp[]} props.sections
 * @param {import('../type').SubBrand[]} props.subBrands
 * @param {import('../type').Promotion[]} props.promotions
 * @param {import('../type').SocialMedia[]} props.socialMedia
 * @param {{name: string, href:string}[]} props.displayedPartners
 * @returns {React.ReactElement}
 */
export default function MobileSidebar({
  topics,
  sections = [],
  subBrands,
  promotions,
  socialMedia,
  displayedPartners = [],
}) {
  const [openSidebar, setOpenSidebar] = useState(false)
  const [openSection, setOpenSection] = useState('')
  const sideBarRef = useRef(null)
  useClickOutside(sideBarRef, () => {
    setOpenSidebar(false)
  })

  return (
    <>
      <HamburgerButton handleOnClick={() => setOpenSidebar((val) => !val)} />
      <SideBar shouldShowSidebar={openSidebar} ref={sideBarRef}>
        <SideBarTop>
          <CloseButton
            color="white"
            handleOnClick={() => setOpenSidebar((val) => !val)}
          />
          <Topics>
            {topics.map((topic) => (
              <Topic href={`topic/${topic.slug}`} key={topic.id}>
                {topic.name}
              </Topic>
            ))}
            <Topic href={`/section/topic`}>更多</Topic>
          </Topics>
          {sections.map(({ id, slug, categories, name, href }) => (
            <Fragment key={id}>
              <Section sectionSlug={slug}>
                <Link style={{ width: '50%' }} href={href}>
                  <h3>{name}</h3>
                </Link>
                <SectionToggle
                  onClick={() => setOpenSection(slug)}
                  shouldOpen={slug === openSection}
                ></SectionToggle>
              </Section>
              <Categories
                shouldShowCategories={slug === openSection}
                sectionSlug={slug}
              >
                {categories.map((category) => (
                  <a key={category.id} href={category.href}>
                    {category.name}
                  </a>
                ))}
              </Categories>
            </Fragment>
          ))}
          {displayedPartners.map(({ name, href }) => (
            <Section key={name}>
              <Link style={{ width: '50%' }} href={href}>
                <h3>{name}</h3>
              </Link>
            </Section>
          ))}
        </SideBarTop>
        <SideBarBottom>
          <SubBrandList>
            {subBrands.map((brand) => (
              <li key={brand.name}>
                <a
                  href={brand.href}
                  target="_blank"
                  rel="noopener noreferer noreferrer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/${brand.name}-colorless.png`}
                    alt={brand.title}
                  />
                </a>
              </li>
            ))}
          </SubBrandList>
          <PromotionList>
            {promotions.map((promotion) => (
              <li key={promotion.name}>
                <Link href={promotion.href} target="_blank">
                  {promotion.title}
                </Link>
              </li>
            ))}
          </PromotionList>
        </SideBarBottom>
        <SocialMediaList>
          {socialMedia.map(({ name, href }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer noopenner"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={name}
                src="/images/transperent.png"
                alt={name}
              ></img>
            </a>
          ))}
        </SocialMediaList>
      </SideBar>
    </>
  )
}
