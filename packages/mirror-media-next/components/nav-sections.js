//TODO: When user at certain section, at category which belongs to certain section, at story which belongs to certain section
//component <Section> will change color of title to section color defined at /styles/sections-color.

import styled from 'styled-components'
import { minWidth } from '../styles/media'
import { sectionColors } from '../styles/sections-color'
import Logo from './logo'
const SectionsWrapper = styled.section`
  font-size: 14px;
  // to hide scrollbar
  overflow: hidden;
  width: 100%;
  margin: 0 auto 8px;
  @media ${minWidth.xl} {
    font-size: 20px;
    height: auto;
    overflow: visible;
    margin-bottom: 10px;
  }
`
const Sections = styled.ul`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  max-width: 1024px;
  width: fit-content;
  margin: 0 auto;
  text-align: center;

  // to hide scrollbar
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
    /* WebKit */
    width: 0;
    height: 0;
  }
  @media ${minWidth.xl} {
    width: 100%;
    height: auto;
    justify-content: center;
    overflow: visible;
  }
`
const Section = styled.li`
  flex: 0 0 auto;
  position: relative;
  width: fit-content;
  cursor: pointer;
  user-select: none;
  line-height: 1.15;
  color: rgba(0, 0, 0, 0.87);

  @media ${minWidth.xl} {
    line-height: 150%;
    min-width: calc(100% / 11);
  }

  &.member {
    @media ${minWidth.xl} {
      background: #000000;
      color: #fff;
    }
  }

  &:hover {
    ${({ color }) => color && `color: ${color}`}
  }
`
const SectionLink = styled.a`
  display: block;
  font-weight: 700;
  padding: 7px 6px 5px 6px;
  @media ${minWidth.xl} {
    padding: 9px 16px 9px 16px;
  }
`

const SectionLogo = styled(Logo)`
  width: 49px;
  height: 20.72px;
  @media ${minWidth.md} {
    display: none;
  }
`
const SectionLinkLogo = styled(SectionLink)`
  padding-top: 3px;
  @media ${minWidth.md} {
    padding-top: 7px;
  }
  @media ${minWidth.xl} {
    padding-top: 9px;
  }
  h2 {
    display: none;
    @media ${minWidth.md} {
      display: block;
    }
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
  @media ${minWidth.xl} {
    ${Section}:hover & {
      display: block;
    }
  }
`
const CategoryLink = styled.a`
  display: block;
  line-height: 1.3;
  padding: 7px 11px 5px 11px;
  &:hover {
    ${({ color }) => color && `color: ${color};`}
  }
  @media ${minWidth.xl} {
    padding: 9px 14px 9px 14px;
  }
`
function getCategoryHref(sectionName, categoryName) {
  if (sectionName === 'videohub') {
    return `/video_category/${categoryName}`
  }
  if (categoryName === 'magazine') {
    return '/magazine/'
  }
  return `/category/${categoryName}`
}
/**
 * @param {{sections: import('../type').Section[] | []  }} props
 * @returns {React.ReactElement}
 */
export default function NavSections({ sections }) {
  return (
    <SectionsWrapper>
      <Sections>
        <Section>
          <SectionLinkLogo href="/">
            <h2>首頁</h2>
            <SectionLogo />
          </SectionLinkLogo>
        </Section>
        {sections.map((section) => (
          <Section
            key={section._id}
            color={sectionColors[section.name]}
            className={section.name}
          >
            <SectionLink href={`/section/${section.name}`}>
              <h2>{section.title}</h2>
            </SectionLink>
            <SectionDropDown>
              {section.categories.map((category) => (
                <CategoryLink
                  key={category._id}
                  href={getCategoryHref(section.name, category.name)}
                  color={sectionColors[section.name]}
                >
                  <h3>{category.title}</h3>
                </CategoryLink>
              ))}
            </SectionDropDown>
          </Section>
        ))}
      </Sections>
    </SectionsWrapper>
  )
}
