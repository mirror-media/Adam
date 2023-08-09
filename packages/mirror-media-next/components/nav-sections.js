//TODO: When user at certain section, at category which belongs to certain section, at story which belongs to certain section
//component <Section> will change color of title to section color defined at /styles/sections-color.
//TODO: Replace <a> to <Link> for Single Page Application
import styled, { css } from 'styled-components'
import { minWidth } from '../styles/media'
import Logo from './logo'
/**
 * @typedef {import('../type/theme').Theme} Theme
 */

const colorCss = css`
  color: ${
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
 * @typedef {import('../apollo/fragments/section').Section} Section
 */

/**
 * @typedef {import('../apollo/fragments/section').SectionWithCategory} SectionWithCategory
 */

/**
 * @typedef {Omit<Section, 'categories' > & {href: string, categories: Array.<SectionWithCategory & { href: string }> }} SectionWithHrefTemp
 */
const SectionsWrapper = styled.nav`
  font-size: 14px;
  line-height: 1.5;
  // to hide scrollbar
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
  display: flex;
  gap: 10px;
  @media ${minWidth.xl} {
    font-size: 16px;
    height: auto;
    overflow: visible;
  }
`
const Sections = styled.ul`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  padding: 0;
  // to hide scrollbar
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
    /* WebKit */
    width: 0;
    height: 0;
  }
  ${({ theme }) => theme.breakpoint.md} {
    width: 100%;
    justify-content: space-between;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    height: auto;
    overflow: visible;
  }
`
const Section = styled.li`
  flex: 0 0 auto;
  position: relative;
  cursor: pointer;
  user-select: none;
  line-height: 1.15;
  color: rgba(0, 0, 0, 0.87);

  ${({ theme }) => theme.breakpoint.xl} {
    line-height: 150%;
    flex-shrink: 1;
    width: 100%;
    min-width: calc(100% / 11);
    &.member {
      color: #fff;
      background-color: #000000;
    }
  }
  &:hover {
    ${
      /**
       * @param {Object} param
       * @param {string} [param.sectionSlug]
       */
      ({ sectionSlug }) => (sectionSlug ? colorCss : 'color: #000;')
    }
  }
`
const SectionLink = styled.a`
  display: block;
  width: 100%;
  font-weight: 700;
  padding: 7px 6px 5px 6px;
  ${({ theme }) => theme.breakpoint.xl} {
    padding: 9px 16px 9px 16px;
  }
`

const LogoIcon = styled(Logo)`
  width: 49px;
  height: 20.72px;
  ${({ theme }) => theme.breakpoint.md} {
    display: none;
  }
`
const SectionLogo = styled.div`
  background-color: #fff;

  padding: 4px 0 4px 8px;
  ${({ theme }) => theme.breakpoint.md} {
    display: none;
  }
`

const SectionDropDown = styled.div`
  position: absolute;
  display: none;
  width: 100%;
  left: 0;
  top: 100%;
  background-color: #333;
  text-align: center;
  z-index: 20;
  color: #fff;
  ${({ theme }) => theme.breakpoint.xl} {
    ${Section}:hover & {
      display: block;
    }
  }
`
const CategoryLink = styled.a`
  display: block;
  &:hover {
    ${
      /**
       * @param {Object} param
       * @param {string} param.sectionSlug
       */
      ({ sectionSlug }) => (sectionSlug ? colorCss : 'color: #fff;')
    }
  }
  ${({ theme }) => theme.breakpoint.xl} {
    padding: 8px 14px 8px 14px;
  }
`

/**
 * @param {Object} props
 * @param {SectionWithHrefTemp[]} props.sections
 * @param {{name: string, href:string}[]} props.displayedPartners
 * @returns {React.ReactElement}
 */
export default function NavSections({ sections = [], displayedPartners = [] }) {
  return (
    <SectionsWrapper>
      <SectionLogo>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">
          <LogoIcon />
        </a>
      </SectionLogo>
      <Sections>
        {sections.map((section) => (
          <Section key={section.id} sectionSlug={section?.slug}>
            <SectionLink href={section.href}>
              <h2>{section.name}</h2>
            </SectionLink>
            <SectionDropDown>
              {section.categories.map((category) => (
                <CategoryLink
                  key={category.id}
                  href={category.href}
                  sectionSlug={section?.slug}
                >
                  <h3>{category.name}</h3>
                </CategoryLink>
              ))}
            </SectionDropDown>
          </Section>
        ))}
        <>
          {displayedPartners.map((partner) => (
            <Section key={partner.name}>
              <SectionLink href={partner.href}>
                <h2>{partner.name}</h2>
              </SectionLink>
            </Section>
          ))}
        </>
      </Sections>
    </SectionsWrapper>
  )
}
