import styled from 'styled-components'
import { minWidth } from '../styles/media'
import { sectionColors } from '../styles/sections-color'

const SectionsWrapper = styled.section`
  font-size: 14px;
  // to hide scrollbar
  height: 48px;
  overflow: hidden;

  display: flex;
  justify-content: center;
  @media ${minWidth.xl} {
    font-size: 20px;
    height: auto;
    overflow: visible;
  }
  a {
    display: block;
  }
`
const Sections = styled.ul`
  height: 48px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
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
  cursor: pointer;
  user-select: none;
  line-height: 1.15;
  color: rgba(0, 0, 0, 0.87);
  padding-top: 0;

  @media ${minWidth.md} {
    padding: 0;
    border-top-color: #000;
    ${({ color }) =>
      color &&
      `
    &:hover {
      background: inherit;
      h2 {
        color: ${color};
      }
      & .dropdown a:hover {
        background-color: ${color};
      }
    }
  `}
  }
  @media ${minWidth.xl} {
    line-height: 150%;
    min-width: calc(100% / 11);

    &:hover .dropdown {
      display: block;
    }
    &.home {
      display: none;
    }
  }

  &:hover {
    color: #34495e;
    @media ${minWidth.xl} {
      color: #fff;
    }
  }
  ${({ color }) =>
    color &&
    `
    color: ${color};
  `}
  &.member {
    background: #000000;
    color: #fff;
    &:hover {
      color: #fff;
    }
    &.active {
      color: #fff;
    }
  }
`
const SectionLink = styled.a`
  padding: 7px 11px 5px 11px;
  @media ${minWidth.xl} {
    padding: 9px 14px 9px 14px;
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
`
const CategoryLink = styled.a`
  line-height: 1.3;
  padding: 7px 11px 5px 11px;
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

export default function NavSections({ sections }) {
  return (
    <SectionsWrapper>
      <Sections>
        <Section className="home">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <SectionLink href="/">
            <h2>首頁</h2>
          </SectionLink>
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
            <SectionDropDown className="dropdown">
              {section.categories.map((category) => (
                <CategoryLink
                  key={category._id}
                  href={getCategoryHref(section.name, category.name)}
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
