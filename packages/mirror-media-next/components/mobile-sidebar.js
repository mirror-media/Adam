import styled from 'styled-components'
import { Fragment, useState, useRef } from 'react'
import { sectionColors } from '../styles/sections-color'
import useClickOutside from '../hooks/useClickOutside'

const SideBarButton = styled.button`
  user-select: none;
  display: block;
  margin-left: 16px;
  &:focus {
    border: none;
    outline: none;
  }
  .hamburger {
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
const SideBar = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #054f77;
  padding: 24px;
  height: 100vh;
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
  ${SideBarButton} {
    width: 28px;
    height: 28px;
    padding: 4px;
    display: flex;
    position: absolute;
    top: 0px;
    right: 0px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .close {
      border: 1px solid #fff;
      border-radius: 50%;
      height: 20px;
      width: 20px;
      margin: 0 auto;
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
const Section = styled.button`
  display: block;
  width: 100%;
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
  &::after {
    top: 14px;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10.4px 6px 0 6px;
    border-color: #fff transparent transparent transparent;
  }
  &:focus {
    outline: none;
    &::after {
      border-width: 6px 10.4px 6px 0;
      border-color: transparent #fff transparent transparent;
    }
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
    ({ shouldShowCategories }) => (shouldShowCategories ? '12px' : '0')
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

export default function MobileSidebar({ topics, sections }) {
  const [openSidebar, setOpenSidebar] = useState(false)
  const [openSection, setOpenSection] = useState('')
  const sideBarRef = useRef(null)
  useClickOutside(sideBarRef, () => {
    setOpenSidebar(false)
  })

  return (
    <>
      <SideBarButton onClick={() => setOpenSidebar((val) => !val)}>
        <div className="hamburger"></div>
        <div className="hamburger"></div>
        <div className="hamburger"></div>
      </SideBarButton>
      <SideBar shouldShowSidebar={openSidebar} ref={sideBarRef}>
        <SideBarButton onClick={() => setOpenSidebar((val) => !val)}>
          <div className="close"></div>
        </SideBarButton>
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
            <Section
              onClick={() => setOpenSection(name)}
              color={sectionColors[name]}
            >
              {title}
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
      </SideBar>
    </>
  )
}
