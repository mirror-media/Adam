import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import DraftRenderBlock from '../shared/draft-renderer-block'
import { MirrorMedia } from '@mirrormedia/lilith-draft-renderer'
const { getContentTextBlocks } = MirrorMedia
import Credits from './potography-credits'
import HeroSection from './hero-section'
import Header from './photography-header'
import Slide from './slide'
import RelatedPosts from './related-posts'
import { ArrowDown } from './icons'
import Footer from '../../shared/footer'

/**
 * Determines if the current browser is Safari.
 *
 * @return {boolean} Returns true if the browser is Safari, false otherwise.
 */
const isSafari = () => {
  return /^((?!chrome|android|mobile).)*safari/i.test(navigator.userAgent)
}

const Main = styled.main`
  margin: auto;
  padding-bottom: 40px;
  width: 100%;
  background-color: #333333;

  .content {
    // Only render contents besides the images and captions via draft renderer.
    figure {
      display: none;
    }

    margin-top: 52px;

    ${({ theme }) => theme.breakpoint.md} {
      margin-top: 70px;
    }
  }

  p {
    color: white;
  }

  // Snap scrolling effect
  height: 100vh;
  scroll-snap-type: ${({
    // @ts-ignore
    isSafari,
  }) => (isSafari ? 'y proximity' : 'y mandatory')};
  scroll-snap-type: ${({
    // @ts-ignore
    isSafari,
  }) =>
    isSafari
      ? '-webkit-scroll-snap-type: y proximity'
      : '-webkit-scroll-snap-type: y mandatory'};
  overflow: auto;

  // Hide the scroll bar
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }
`

const Page = styled.div`
  position: relative;
  height: 100vh;
  overflow: auto;
  // snap scrolling effect
  scroll-snap-align: start;
  scroll-snap-stop: always;
  -webkit-scroll-snap-align: start;
  -webkit-scroll-snap-stop: always;
`

const ContentContainer = styled.div`
  width: 80%;
  margin: auto;
`

const ArrowButton = styled.button`
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  border: none;
  outline: none;
  cursor: pointer;
  width: 24px;
  height: 12px;

  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in;

  &:focus {
    outline: 0;
  }

  svg {
    line {
      stroke: rgba(255, 255, 255, 0.7);
    }
  }

  &:hover {
    transform: translateX(-50%) translateY(6px);
    svg {
      line {
        stroke: white;
      }
    }
  }

  ${({ theme }) => theme.breakpoint.md} {
    bottom: 24px;
    width: 52px;
    height: 26px;
  }
`

/**
 * @typedef {import('../../../apollo/fragments/post').Post} PostData
 */

/**
 * @typedef {Object} PostContent
 * @property {'fullContent' | 'trimmedContent'} type
 * @property {Pick<PostData,'content'>['content']} data
 * @property {boolean} isLoaded
 */

/**
 *
 * @param {Object} param
 * @param {PostData} param.postData
 * @param {PostContent} param.postContent
 * @returns
 */

export default function StoryPhotographyStyle({ postData, postContent }) {
  const {
    title = '',
    heroImage = null,
    heroCaption = '',
    writers = [],
    writersInInputOrder = [],
    photographers = [],
    camera_man = [],
    designers = [],
    engineers = [],
    vocals = [],
    extend_byline = '',
    relateds = [],
    relatedsInInputOrder = [],

    brief = null,
  } = postData

  const filteredBrief = getContentTextBlocks(brief)

  const credits = [
    { writers: writersInInputOrder ? writersInInputOrder : writers },
    { photographers: photographers },
    { camera_man: camera_man },
    { designers: designers },
    { engineers: engineers },
    { vocals: vocals },
    { extend_byline: extend_byline },
  ]

  const relatedsWithOrdered =
    relatedsInInputOrder && relatedsInInputOrder.length
      ? relatedsInInputOrder
      : relateds

  // Get images array from content.entityMap
  const photosArray = Object.values(postContent.data.entityMap).filter(
    (item) => item.type === 'image'
  )

  // Page ArrowDown button click handler
  const pageRefs = useRef([])
  const buttonRefs = useRef([])
  const lastContentRef = useRef(null)

  const handleHeroButtonClick = () => {
    if (pageRefs.current[0]) {
      pageRefs.current[0].scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSlidesButtonClick = (buttonIndex) => {
    if (buttonIndex < photosArray.length - 1) {
      pageRefs.current[buttonIndex + 1].scrollIntoView({ behavior: 'smooth' })
    } else if (buttonIndex === photosArray.length - 1) {
      if (lastContentRef.current) {
        lastContentRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      const currentIndex = buttonRefs.current.findIndex(
        (ref) => ref && ref === document.activeElement
      )
      if (currentIndex >= 0 && currentIndex < buttonRefs.current.length - 1) {
        buttonRefs.current[currentIndex + 1].focus()
      }
    } else if (event.key === 'ArrowUp') {
      const currentIndex = buttonRefs.current.findIndex(
        (ref) => ref && ref === document.activeElement
      )
      if (currentIndex > 0) {
        buttonRefs.current[currentIndex - 1].focus()
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const [isTransparent, setIsTransparent] = useState(true)
  const handleCaptionClick = () => {
    setIsTransparent((prevState) => !prevState)
  }

  const [isSafariDevice, setIsSafariDevice] = useState(false)

  useEffect(() => {
    setIsSafariDevice(isSafari())
  }, [])

  return (
    <Main
      // @ts-ignore
      isSafari={isSafariDevice}
    >
      <Header />
      <Page>
        <HeroSection
          title={title}
          heroCaption={heroCaption}
          brief={filteredBrief}
          heroImage={heroImage}
        />

        <ArrowButton onClick={handleHeroButtonClick}>
          <ArrowDown />
        </ArrowButton>
      </Page>

      {photosArray.map((photo, index) => (
        <Page key={index} ref={(el) => (pageRefs.current[index] = el)}>
          <Slide
            photoData={photo}
            isTransparent={isTransparent}
            handleCaptionClick={handleCaptionClick}
          />
          <ArrowButton
            ref={(el) => (buttonRefs.current[index] = el)}
            onClick={() => handleSlidesButtonClick(index)}
          >
            <ArrowDown />
          </ArrowButton>
        </Page>
      ))}

      <Page ref={lastContentRef}>
        <ContentContainer>
          <section className="content">
            <DraftRenderBlock
              rawContentBlock={postContent.data}
              contentLayout="photography"
            />
          </section>
          <Credits credits={credits}></Credits>
        </ContentContainer>
        <RelatedPosts relateds={relatedsWithOrdered} />
        <Footer footerType="default" />
      </Page>
    </Main>
  )
}
