import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import YouTube from 'react-youtube'

import { extractYouTubeId } from '../../utils/youtube'
import useWindowDimensions from '../../hooks/use-window-dimensions'

const Section = styled.section`
  position: relative;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #eee;
  padding: 32px 20px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 40px 20px;
  }
`

const Title = styled.section`
  color: #054f77;
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 28px;
  }
`

const Wrapper = styled.div`
  position: relative;
  width: 100dvw;
  overflow: auto;
  scrollbar-width: none;
`

const Ol = styled.ol`
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  padding: 0 20px;
  position: relative;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  &.centered {
    justify-content: center;
  }
`

const Li = styled.li`
  flex: 0 0 auto;
  width: 320px;
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

/** @type {import('react-youtube').YouTubeProps['opts'] & { playerVars: { mute?: 0 | 1 }}} */
const opts = {
  width: 320,
  height: 180,
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
    controls: 1,
    mute: 0,
    loop: 1,
  },
}

/**
 * @typedef {import('../../apollo/fragments/promote-video').PromoteVideo} PromoteVideo
 */

/**
 * @param {{ promoVideos: PromoteVideo[] }} props
 */

export default function PromoVideoList({ promoVideos }) {
  /** @type {React.RefObject<HTMLOListElement | null>} */
  const containerRef = useRef(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)
  const [centerItems, setCenterItems] = useState(false)
  const { width } = useWindowDimensions()

  const updateButtonVisibility = useCallback(() => {
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
      updateButtonVisibility()

      // Disconnect after first load
      resizeObserver.disconnect()
    })

    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [updateButtonVisibility])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    updateButtonVisibility()

    container.addEventListener('scroll', updateButtonVisibility)
    return () => {
      container.removeEventListener('scroll', updateButtonVisibility)
    }
  }, [promoVideos, width, updateButtonVisibility])

  /**
   * Scroll to the start of the list
   * @param {React.MouseEvent<HTMLElement>} e
   */
  const handleClickPrev = (e) => {
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    container.scrollTo({
      left: 0,
      behavior: 'smooth',
    })
  }

  /**
   * Scroll to the start of the list
   * @param {React.MouseEvent<HTMLElement>} e
   */
  const handleClickNext = (e) => {
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    container.scrollTo({
      left: container.scrollWidth - container.clientWidth,
      behavior: 'smooth',
    })
  }

  return (
    <Section>
      <Title>最新影音</Title>
      <Wrapper>
        <Ol ref={containerRef} className={centerItems && 'centered'}>
          {promoVideos.map((video) => {
            const youtubeId = extractYouTubeId(video.videoLink)
            return (
              <Li key={`${youtubeId}-${video.id}`}>
                <YouTube
                  videoId={youtubeId}
                  id={youtubeId}
                  title="Embedded youtube"
                  opts={opts}
                />
              </Li>
            )
          })}
        </Ol>
        {showLeftButton && (
          <ArrowButtonLeft
            type="button"
            onClick={handleClickPrev}
            aria-label="Scroll to first video"
          />
        )}
        {showRightButton && (
          <ArrowButtonRight
            type="button"
            onClick={handleClickNext}
            aria-label="Scroll to last video"
          />
        )}
      </Wrapper>
    </Section>
  )
}
