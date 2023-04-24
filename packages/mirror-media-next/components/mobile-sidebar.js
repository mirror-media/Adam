import styled from 'styled-components'
import React, { Fragment, useState, useRef } from 'react'
import { sectionColors } from '../styles/sections-color'
import useClickOutside from '../hooks/useClickOutside'
import Link from 'next/link'
const SideBarButton = styled.button`
  user-select: none;
  display: block;
  margin-left: 16px;
  &:focus {
    border: none;
    outline: none;
  }
  .hamburger {
    display: block;
    width: 16px;
    height: 2px;
    background-color: black;
    margin: 2px 0;
    border-radius: 12px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
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
    left: ${
      /** @param {{shouldShowSidebar: Boolean}} props */
      ({ shouldShowSidebar }) => (shouldShowSidebar ? '0' : '-100%')
    };
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`
const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  padding: 4px;
  display: flex;
  position: absolute;
  top: 0px;
  right: 0px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &:focus {
    outline: none;
  }
  .close {
    border: 1px solid #fff;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    margin: 0 5px 0 0;
    position: relative;
    &:before,
    :after {
      position: absolute;
      left: 8.5px;
      top: 5px;
      transform: translate(-50%, -50%);
      content: ' ';
      height: 8.5px;
      width: 1.2px;
      background-color: #fff;
    }
    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
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
    background-color: ${({ color }) => (color ? color : '#fff')};
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
  color: ${({ color }) => (color ? color : '#fff')};
  margin-top: ${
    /** @param {{shouldShowCategories: Boolean}} props */
    ({ shouldShowCategories }) => (shouldShowCategories ? '12px' : '0px')
  };
  gap: ${
    /** @param {{shouldShowCategories: Boolean}} props */
    ({ shouldShowCategories }) => (shouldShowCategories ? '4px 12px' : '0px')
  };
  transition: all 0.5s ease-in-out;

  a {
    height: ${
      /** @param {{shouldShowCategories: Boolean}} props */
      ({ shouldShowCategories }) => (shouldShowCategories ? '21px' : '0')
    };
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
  display: flex;
  color: #bcbcbc;
  justify-content: start;
  flex-wrap: wrap;
  row-gap: 9px;
  li {
    min-width: 33.33%;
  }
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
 * @param {import('../type').Topic[]} props.topics
 * @param {import('../type').Section[]} props.sections
 * @param {import('../type').SubBrand[]} props.subBrands
 * @param {import('../type').Promotion[]} props.promotions
 * @param {import('../type').SocialMedia[]} props.socialMedia
 * @returns {React.ReactElement}
 */
export default function MobileSidebar({
  topics,
  sections,
  subBrands,
  promotions,
  socialMedia,
}) {
  const [openSidebar, setOpenSidebar] = useState(false)
  const [openSection, setOpenSection] = useState('')
  const sideBarRef = useRef(null)
  useClickOutside(sideBarRef, () => {
    setOpenSidebar(false)
  })

  return (
    <>
      <SideBarButton onClick={() => setOpenSidebar((val) => !val)}>
        <i className="hamburger"></i>
        <i className="hamburger"></i>
        <i className="hamburger"></i>
      </SideBarButton>
      <SideBar shouldShowSidebar={openSidebar} ref={sideBarRef}>
        <SideBarTop>
          <CloseButton onClick={() => setOpenSidebar((val) => !val)}>
            <i className="close"></i>
          </CloseButton>
          <Topics>
            {topics.map((topic) => (
              <Topic href={`topic/${topic._id}`} key={topic._id}>
                {topic.name}
              </Topic>
            ))}
            <Topic href={`/section/topic`}>更多</Topic>
          </Topics>
          {sections.map(({ _id, title, categories, name }) => (
            <Fragment key={_id}>
              <Section color={sectionColors[name]}>
                <Link style={{ width: '50%' }} href={`/section/${title}`}>
                  <h3>{title}</h3>
                </Link>
                <SectionToggle
                  onClick={() => setOpenSection(name)}
                  shouldOpen={name === openSection}
                ></SectionToggle>
              </Section>
              <Categories
                shouldShowCategories={name === openSection}
                color={sectionColors[name]}
              >
                {categories.map((category) => (
                  <a key={category._id} href={`/category/${category.name}`}>
                    {category.title}
                  </a>
                ))}
              </Categories>
            </Fragment>
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
                <a href={promotion.href}>{promotion.title}</a>
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
