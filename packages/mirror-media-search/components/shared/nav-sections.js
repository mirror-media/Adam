import { useContext } from 'react'
import styled from 'styled-components'
import { RedirectUrlContext } from '../../context/redirectUrl'
import { minWidth } from '../../styles/media'
import { sectionColors } from '../../styles/sections-color'

const SectionsWrapper = styled.section`
  font-size: 14px;
  // to hide scrollbar
  height: 36px;
  overflow: hidden;

  display: flex;
  justify-content: center;
  @media ${minWidth.xl} {
    background-color: #064f77;
    font-size: 16px;
    height: auto;
    overflow: visible;
  }
  a {
    display: block;
  }
`
const Sections = styled.div`
  // to hide scrollbar
  height: 48px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-x: auto;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  @media ${minWidth.xl} {
    width: 100%;
    height: 45px;
    justify-content: center;
    overflow: visible;
  }
`
const Section = styled.div`
  flex: 0 0 auto;
  position: relative;
  cursor: pointer;
  user-select: none;
  line-height: 1.15;
  color: #fff;
  padding-top: 0;
  > a {
    padding: 7px 11px 5px 11px;
    @media ${minWidth.xl} {
      padding: 0;
    }
  }
  @media ${minWidth.xl} {
    line-height: 42px;
    min-width: calc(100% / 11);
    border-top-width: 3px;
    border-top-style: solid;
    &:hover .dropdown {
      display: block;
    }
    &.home {
      display: none;
    }
  }
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
  &:hover {
    color: #34495e;
    @media ${minWidth.xl} {
      color: #fff;
    }
  }
  ${({ active, color }) =>
    active &&
    color &&
    `
    color: ${color};
  `}
  &.member {
    &:hover {
      color: #db1730;
    }
    &.active {
      color: #e51731;
    }
    @media ${minWidth.xl} {
      color: #fff;
      &:hover {
        color: #fff;
      }
      &.active {
        color: #fff;
      }
    }
  }
  &.home {
    color: #fff;
  }
`

const SectionDropDown = styled.div`
  position: absolute;
  display: none;
  width: 110px;
  left: 0;
  top: 100%;
  background-color: #333;
  text-align: center;
  z-index: 20;
  color: #fff;
  a {
    line-height: 1.3;
    padding: 13px 10px;
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
  const redirectUrl = useContext(RedirectUrlContext)
  return (
    <SectionsWrapper>
      <Sections>
        <Section className="home">
          <a href={`${redirectUrl}/`}>
            <h2>首頁</h2>
          </a>
        </Section>
        {sections.map((section) => (
          <Section
            key={section._id}
            color={sectionColors[section.name]}
            className={section.name}
          >
            <a href={`${redirectUrl}/section/${section.name}`}>
              <h2>{section.title}</h2>
            </a>
            <SectionDropDown className="dropdown">
              {section.categories.map((category) => (
                <a
                  key={category._id}
                  href={`${redirectUrl}${getCategoryHref(
                    section.name,
                    category.name
                  )}`}
                >
                  <h3>{category.title}</h3>
                </a>
              ))}
            </SectionDropDown>
          </Section>
        ))}
      </Sections>
    </SectionsWrapper>
  )
}
