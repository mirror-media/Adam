import { useEffect, useState } from 'react'
import styled from 'styled-components'

/**
 * @typedef {Pick<import('../../../type/draft-js').DraftBlock, 'key' | 'text' | 'type'> & { type: 'header-two' | 'header-three'}} H2AndH3Block
 */

const NavWrapper = styled.section`
  position: absolute;
  top: 0;
  left: calc((100vw - 100%) / 2 * -1);
  width: calc((100vw - 100%) / 2);
  height: 100%;
`
const NavItem = styled.li`
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
  cursor: pointer;
  ${
    /**
     * @param {Object} param
     * @param {'header-two' | 'header-three'} param.headerType
     * @param {boolean} param.isActive
     */
    ({ headerType }) => {
      switch (headerType) {
        case 'header-two':
          return `  
        font-size: 18px;
        line-height: 1.5;
        `
        case 'header-three':
          return `
        font-size: 14px;
        line-height: 2;
        `
        default:
          return `  
        font-size: 18px;
        line-height: 1.5;
        `
      }
    }
  }

  ${({ isActive, theme }) =>
    isActive &&
    `
    color: ${theme.color.brandColor.darkBlue};
    text-decoration: underline;
    `}
`
const Nav = styled.nav`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    position: sticky;
    top: 15%;

    margin: 20px auto;
    width: 168px;
    height: auto;
  }
`
/**
 * TODO: add feature for scroll into certain subtitle
 * @param {Object} props
 * @param {H2AndH3Block[]} props.h2AndH3Block
 * @returns {JSX.Element}
 */
export default function NavSubtitleNavigator({ h2AndH3Block = [] }) {
  const [currentIndex, setCurrentIndex] = useState(undefined)
  const handleOnClick = (key) => {
    const target = document.querySelector(`[data-offset-key*="${key}"]`)
    if (!target) {
      return
    }
    const { top, height } = target.getBoundingClientRect()
    const { scrollY, innerHeight } = window

    const y = top + height * 0.5 + scrollY - innerHeight * 0.5
    scrollTo({
      top: y,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    let observer
    if (h2AndH3Block.length) {
      const targets = h2AndH3Block.map((item) =>
        //TODO: use `forwardRef` to get ref of component which render article content, and querySelect element inside of it,
        //not just use `document.body.querySelector`.
        document.body.querySelector(`[data-offset-key*="${item.key}"]`)
      )

      /**
       * An Array to keep track of which subtitle is currently visible on the viewport.
       * Each object in the array has the following properties:
       *   - key: the key of the subtitle
       *   - isVisible: a boolean that indicates whether the subtitle is currently visible on the viewport
       */
      const visibleSubtitles = h2AndH3Block.map((item) => {
        return {
          key: item.key,
          isIntersecting: false,
        }
      })
      /**
       * Updates the current subtitle index based on the changes of the visibility of the subtitles.
       * @param {string} offsetKey - the offset key of the subtitle element
       * @param {boolean} isIntersecting - a boolean that indicates whether the subtitle is currently visible on the viewport
       */
      const updateCurrentIndexIfVisible = (offsetKey, isIntersecting) => {
        const item = visibleSubtitles.find((item) =>
          offsetKey.includes(item.key)
        )

        if (item && item.isIntersecting !== isIntersecting) {
          item.isIntersecting = isIntersecting
          const lastIndex = visibleSubtitles.findLastIndex(
            (item) => item.isIntersecting
          )
          if (lastIndex !== -1) {
            const lastKey = visibleSubtitles[lastIndex].key
            setCurrentIndex(lastKey)
          }
        }
      }

      const callback = (entries) => {
        entries.forEach((entry) => {
          updateCurrentIndexIfVisible(
            entry.target.dataset.offsetKey,
            entry.isIntersecting
          )
        })
      }
      observer = new IntersectionObserver(callback, {
        threshold: 0.5,
        rootMargin: '50% 0px -50% 0px',
      })
      targets.forEach((item) => observer.observe(item))
    }
    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [h2AndH3Block])

  return (
    <NavWrapper>
      {h2AndH3Block.length ? (
        <Nav>
          <ul>
            {h2AndH3Block.map((item) => (
              <NavItem
                isActive={
                  currentIndex ? currentIndex.includes(item.key) : false
                }
                headerType={item.type}
                key={item.key}
                onClick={() => handleOnClick(item.key)}
              >
                <a href={`#header-${item.key}`}>{item.text}</a>
              </NavItem>
            ))}
          </ul>
        </Nav>
      ) : null}
    </NavWrapper>
  )
}
