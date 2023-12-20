//TODO: When user at certain section, at category which belongs to certain section, at story which belongs to certain section
//component <Section> will change color of title to section color defined at /styles/sections-color.
//TODO: Replace <a> to <Link> for Single Page Application
import styled, { css } from 'styled-components'
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

const SectionsWrapper = styled.nav`
  font-size: 14px;
  line-height: 1.5;
  // to hide scrollbar
  overflow: hidden;
  width: 100%;
  margin: 0 auto 0;
  display: flex;
  gap: 70px;
  ${({ theme }) => theme.breakpoint.xl} {
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
  &:hover {
    color: ${
      /**
       *
       * @param {Object} param
       * @param {Theme} param.theme
       * @param {string} [param.sectionSlug]
       */
      ({ sectionSlug, theme }) => {
        if (sectionSlug === 'member') {
          return '#e51731'
        } else if (sectionSlug && theme.color.sectionsColor[sectionSlug]) {
          return `${theme.color.sectionsColor[sectionSlug]}`
        } else {
          return '#000'
        }
      }
    };
  }

  ${
    /**
     * @param {Object} param
     * @param {Theme} param.theme
     * @param {string} [param.sectionSlug]
     */
    ({ theme }) => theme.breakpoint.xl
  } {
    line-height: 150%;
    flex-shrink: 1;
    width: 100%;
    min-width: calc(100% / 11);
    &.member {
      color: #fff;
      background-color: #000000;
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
    color: ${({ sectionSlug }) => (sectionSlug ? colorCss : ' #fff')};
  }
  ${
    /**
     *
     * @param {Object} param
     * @param {Theme} param.theme
     * @param {string} param.sectionSlug
     */
    ({ theme }) => theme.breakpoint.xl
  } {
    padding: 8px 14px 8px 14px;
  }
`
/**
 * @param {Object} props
 * @param {import('./premium-header').PremiumHeaderSection[]} props.sections
 * @param {import('react').ReactNode} props.children
 * @returns {React.ReactElement}
 */
export default function PremiumNavSections({ sections, children }) {
  return (
    <SectionsWrapper>
      <Sections>
        {sections.map((section) => (
          <Section key={section.id} sectionSlug={section?.slug}>
            <SectionLink href={`/premiumsection/${section.slug}`}>
              <div>{section.name}</div>
            </SectionLink>
            <SectionDropDown>
              {section.categories.map((category) => (
                <CategoryLink
                  key={category.id}
                  href={`/category/${category.slug}`}
                  sectionSlug={section.slug}
                >
                  <div>{category.name}</div>
                </CategoryLink>
              ))}
            </SectionDropDown>
          </Section>
        ))}
        <Section>
          <SectionLink href={`/magazine`}>
            <div>動態雜誌</div>
          </SectionLink>
        </Section>
      </Sections>
      {children}
    </SectionsWrapper>
  )
}
