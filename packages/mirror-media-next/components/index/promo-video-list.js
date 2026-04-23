import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import YouTube from 'react-youtube'

import { extractYouTubeId } from '../../utils/youtube'
import { FullBleedBackgroundStyle } from '../shared/full-bleed-background'
import { IndexTitle } from './share/index-title'

const StyledSection = styled.section`
  ${FullBleedBackgroundStyle}

  --promo-video-inline-padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #eee;
  padding: 32px var(--promo-video-inline-padding);
  gap: 20px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 40px var(--promo-video-inline-padding);
  }
`

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  max-width: none;
  margin-inline: calc(50% - 50vw);

  @supports (width: 100dvw) {
    width: 100dvw;
    margin-inline: calc(50% - 50dvw);
  }
`

const StyledOl = styled.ol`
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  padding: 0 var(--promo-video-inline-padding);
  position: relative;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &.centered {
    justify-content: center;
  }
`

const ytWrapperClass = 'yt-wrapper'
const ytIframeClass = 'yt-iframe'

const StyledLi = styled.li`
  flex: 0 0 auto;
  width: 360px;

  .${ytWrapperClass} {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  .${ytWrapperClass} > iframe.${ytIframeClass} {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`

const ArrowButtonBase = styled.button`
  display: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: black;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  cursor: pointer;
  border: none;
  padding: 0;

  ${({ theme }) => theme.breakpoint.md} {
    display: flex;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    cursor: pointer;
  }
  &:focus {
    outline: none;
  }

  &::before {
    content: '';
    width: 18px;
    height: 18px;
    border-top: 3px solid white;
    border-left: 3px solid white;
    position: absolute;
  }
`

const ArrowButtonLeft = styled(ArrowButtonBase)`
  left: 12px;

  &::before {
    left: calc(50% + 3px);
    transform: translate(-50%, 0) rotate(-45deg);
  }
`

const ArrowButtonRight = styled(ArrowButtonBase)`
  right: 12px;

  &::before {
    left: calc(50% - 3px);
    transform: translate(-50%, 0) rotate(135deg);
  }
`

/**
 * Number of items to scroll per click
 * @type {number}
 */
const SCROLL_STEP_COUNT = 2

/** @type {import('react-youtube').YouTubeProps['opts'] & { playerVars: { mute?: 0 | 1 }}} */
const opts = {
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
    controls: 1,
    mute: 0,
    loop: 1,
  },
}

/**
 * @typedef {Object} PromoteVideo
 * @property {string} id
 * @property {string} videoLink
 */

/**
 * @param {{ promoVideos: PromoteVideo[] }} props
 */

export default function PromoVideoList({ promoVideos = [] }) {
  /** @type {React.RefObject<HTMLOListElement | null>} */
  const containerRef = useRef(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)
  const [centerItems, setCenterItems] = useState(false)

  const updateScrollUIState = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container

    setCenterItems(scrollWidth <= clientWidth)
    setShowLeftButton(scrollLeft > 0)
    setShowRightButton(scrollLeft + clientWidth < scrollWidth)
  }, [])

  // Run once: Observe container size changes (after YouTube iframe load) to update button visibility
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver(() => {
      updateScrollUIState()
    })

    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [updateScrollUIState])

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    updateScrollUIState()

    container.addEventListener('scroll', updateScrollUIState)
    return () => {
      container.removeEventListener('scroll', updateScrollUIState)
    }
  }, [updateScrollUIState])

  /**
   * Scrolls horizontally to the next or previous item's left edge based on the given direction.
   * Calculates the nearest current item index and moves by SCROLL_STEP_COUNT steps.
   * @param {'left' | 'right'} direction - Direction to scroll toward.
   */
  const scrollToItem = (direction) => {
    const container = containerRef.current
    if (!container) return

    const containerPaddingLeft =
      parseFloat(getComputedStyle(container).paddingLeft) || 0

    const items = Array.from(container.children).map(
      (el) => /** @type {HTMLElement} */ (el)
    )
    const itemLeftPositions = items.map(
      (el) => el.offsetLeft - containerPaddingLeft
    )

    const currentScrollPosition = container.scrollLeft

    // Determine current index based on closest position
    const currentIndex = itemLeftPositions.reduce(
      (closestIdx, leftPosition, idx) => {
        const currentDiff = Math.abs(leftPosition - currentScrollPosition)
        const previousDiff = Math.abs(
          itemLeftPositions[closestIdx] - currentScrollPosition
        )

        return currentDiff < previousDiff ? idx : closestIdx
      },
      0
    )

    const step = SCROLL_STEP_COUNT
    const delta = direction === 'right' ? step : -step
    const targetIndex = Math.min(
      Math.max(currentIndex + delta, 0),
      itemLeftPositions.length - 1
    )

    container.scrollTo({
      left: itemLeftPositions[targetIndex],
      behavior: 'smooth',
    })
  }

  /**
   * @param {'left' | 'right'} direction
   * @returns {(e: React.MouseEvent<HTMLElement>) => void}
   */
  const handleScrollTo = (direction) => (e) => {
    e.preventDefault()
    scrollToItem(direction)
  }

  if (!promoVideos?.length) return null

  return (
    <StyledSection>
      <IndexTitle>最新影音</IndexTitle>
      <Wrapper>
        <StyledOl ref={containerRef} className={centerItems ? 'centered' : ''}>
          {promoVideos.map((video) => {
            const youtubeId = extractYouTubeId(video.videoLink)

            if (!youtubeId) return null
            return (
              <StyledLi key={`${youtubeId}-${video.id}`}>
                <YouTube
                  videoId={youtubeId}
                  id={youtubeId}
                  title="Embedded youtube"
                  className={ytWrapperClass}
                  iframeClassName={ytIframeClass}
                  opts={opts}
                />
              </StyledLi>
            )
          })}
        </StyledOl>
        {showLeftButton && (
          <ArrowButtonLeft
            type="button"
            onClick={handleScrollTo('left')}
            aria-label="Scroll to first video"
          />
        )}
        {showRightButton && (
          <ArrowButtonRight
            type="button"
            onClick={handleScrollTo('right')}
            aria-label="Scroll to last video"
          />
        )}
      </Wrapper>
    </StyledSection>
  )
}
