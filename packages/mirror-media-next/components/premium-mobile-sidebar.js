import styled, { css } from 'styled-components'
import React, { Fragment, useState, useRef } from 'react'
import useClickOutside from '../hooks/useClickOutside'
import NavSubtitleNavigator from './story/shared/nav-subtitle-navigator'

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
/**
 * @typedef {import('./story/shared/nav-subtitle-navigator').H2AndH3Block} H2AndH3Block
 */
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
  background-color: black;
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

const Section = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  color: #fff;
  font-weight: 700;
  position: relative;
  padding: 12px 0 12px;
  border-bottom: 1px solid #fff;
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
    border-width: ${
      /**
       * @param {Object} props
       * @param {Boolean} props.shouldOpen
       * @param {string} props.sectionSlug
       * @param {Theme} [props.Theme]
       */
      ({ shouldOpen }) => (shouldOpen ? '10.4px 6px 0 6px' : '6px 10.4px 6px 0')
    };
    border-color: ${({ shouldOpen, sectionSlug, theme }) => {
      if (shouldOpen) {
        if (sectionSlug === 'member') {
          return `red transparent transparent transparent`
        } else if (sectionSlug && theme.color.sectionsColor[sectionSlug])
          return `${theme.color.sectionsColor[sectionSlug]} transparent transparent transparent;`
        else {
          return `#fff transparent transparent transparent`
        }
      } else {
        return 'transparent #fff transparent transparent;'
      }
    }};
  }
`

const Categories = styled.div`
  display: flex;
  font-weight: 400;
  flex-wrap: wrap;
  gap: 4px 12px;

  margin: ${({ shouldShowCategories }) =>
    shouldShowCategories ? '12px 0 8px 0' : '0px'};
  gap: ${({ shouldShowCategories }) =>
    shouldShowCategories ? '4px 12px' : '0px'};
  transition: all 0.5s ease-in-out;

  color: ${
    /**
     * @param {Object} props
     * @param {boolean} props.shouldShowCategories
     * @param {string} props.sectionSlug
     */
    ({ sectionSlug }) => (sectionSlug ? colorCss : '#fff')
  };

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
const SideBarBottom = styled.div`
  padding: 24px;
  margin-top: ${
    /**
     * @param {Object} param
     * @param {boolean} param.isLargerMarginTop
     */
    ({ isLargerMarginTop }) => (isLargerMarginTop ? '108px' : 0)
  };
`
const SideBarTop = styled.div`
  background-color: #3e3e3e;

  width: 100%;
`

/**
 *
 * @param {Object} props
 * @param {import('./premium-header').PremiumHeaderSection[]} props.sections
 * @param {boolean} [props.shouldShowSubtitleNavigator]
 * @param {H2AndH3Block[]} [props.h2AndH3Block]
 * @returns {React.ReactElement}
 */
export default function PremiumMobileSidebar({
  sections,
  shouldShowSubtitleNavigator = false,
  h2AndH3Block = [],
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
        {shouldShowSubtitleNavigator && (
          <SideBarTop>
            <NavSubtitleNavigator
              h2AndH3Block={h2AndH3Block}
              componentStyle="side-bar"
              handleCloseSideBar={() => setOpenSidebar(false)}
            ></NavSubtitleNavigator>
          </SideBarTop>
        )}
        <SideBarBottom isLargerMarginTop={!shouldShowSubtitleNavigator}>
          <CloseButton onClick={() => setOpenSidebar((val) => !val)}>
            <i className="close"></i>
          </CloseButton>
          {sections.map(({ id, name, categories, slug }) => (
            <Fragment key={id}>
              <Section>
                <a style={{ width: '50%' }} href={`/premiumsection/${slug}`}>
                  <h3>{name}</h3>
                </a>
                <SectionToggle
                  onClick={() => setOpenSection(slug)}
                  shouldOpen={slug === openSection}
                  sectionSlug={slug}
                ></SectionToggle>
              </Section>
              <Categories
                shouldShowCategories={slug === openSection}
                sectionSlug={slug}
              >
                {categories.map((category) => (
                  <a key={category.id} href={`/category/${category.slug}`}>
                    {category.name}
                  </a>
                ))}
              </Categories>
            </Fragment>
          ))}
        </SideBarBottom>
      </SideBar>
    </>
  )
}
