//TODO: When user at certain section, at category which belongs to certain section, at story which belongs to certain section
//component <Section> will change color of title to section color defined at /styles/sections-color.
//TODO: Replace <a> to <Link> for Single Page Application
import styled from 'styled-components'
import { minWidth } from '../styles/media'
import { sectionColors } from '../styles/sections-color'
import Logo from './logo'
const SectionsWrapper = styled.nav`
  font-size: 14px;
  line-height: 1.5;
  // to hide scrollbar
  overflow: hidden;
  width: 100%;
  margin: 0 auto 8px;
  display: flex;
  gap: 10px;
  @media ${minWidth.xl} {
    font-size: 16px;
    height: auto;
    overflow: visible;
    margin-bottom: 10px;
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
  @media ${minWidth.md} {
    width: 100%;
    justify-content: space-between;
  }
  @media ${minWidth.xl} {
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

  @media ${minWidth.xl} {
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
    ${({ color }) => color && `color: ${color}`}
  }
`
const SectionLink = styled.a`
  display: block;
  width: 100%;
  font-weight: 700;
  padding: 7px 6px 5px 6px;
  @media ${minWidth.xl} {
    padding: 9px 16px 9px 16px;
  }
`

const LogoIcon = styled(Logo)`
  width: 49px;
  height: 20.72px;
  @media ${minWidth.md} {
    display: none;
  }
`
const SectionLogo = styled.div`
  background-color: #fff;

  padding: 4px 0 4px 8px;
  @media ${minWidth.md} {
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
  @media ${minWidth.xl} {
    ${Section}:hover & {
      display: block;
    }
  }
`
const CategoryLink = styled.a`
  display: block;
  &:hover {
    ${({ color }) => color && `color: ${color};`}
  }
  @media ${minWidth.xl} {
    padding: 8px 14px 8px 14px;
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
 * TODO: use typedef in `../apollo/fragments/section`
 * Should be done after fetch header data from new json file
 * @param {{sections: import('../type').Section[] | []  }} props
 * @returns {React.ReactElement}
 */
export default function NavSections({ sections }) {
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
