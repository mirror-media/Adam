import CustomImage from '@readr-media/react-image'
import dayjs from 'dayjs'
import { useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import PodcastModal from './podcast-modal'

const CardContainer = styled.li`
  width: 100%;
  background: #f4f5f6;
  overflow: hidden;
  cursor: pointer;

  ${({ theme }) => theme.breakpoint.md} {
    height: 499px;
    width: 244px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }
`
const BlueBar = styled.div`
  height: 26px;
  background: #1d9fb8;
  ${({ theme }) => theme.breakpoint.md} {
    height: 20px;
  }
`
const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  ${({ theme }) => theme.breakpoint.md} {
    height: 244px;
  }
`
const pulseAnimation = keyframes`
  0% {
    transform: scale(1) translate(-50%, -50%);
  }
  50% {
    transform: scale(1.15) translate(-50%, -50%);
  }
  100% {
    transform: scale(1) translate(-50%, -50%);
  }
`

const pulseAnimationCss = css`
  animation: ${pulseAnimation} 1.2s infinite;
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ImageWrapper}:hover & {
    opacity: 1;
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-image: url('/images-next/play-icon.svg');
      background-size: cover;
      width: 28px;
      height: 28px;
      opacity: 0.9;
    }
  }

  ${({
    // @ts-ignore
    listeningPodcast,
  }) =>
    listeningPodcast &&
    css`
      opacity: 1;
      cursor: pointer;
      &::before {
        content: '';
        position: absolute;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-image: url('/images-next/play-icon.svg');
        background-size: cover;
        width: 28px;
        height: 28px;
        opacity: 0.9;
        ${pulseAnimationCss};
        box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.4);
      }
    `}
`

const IntroSection = styled.div`
  background: #efefef;
  padding: 12px 50px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 12px;
  }
`
const Title = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #000;
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  ${({ theme }) => theme.breakpoint.md} {
    min-height: 75px;
  }
`
const DurationIntroWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`
const Duration = styled.span`
  color: #ffa011;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
`
const Intro = styled.span`
  color: #fff;
  font-family: Roboto;
  font-size: 10px;
  font-weight: 700;
  line-height: normal;
  border-radius: 4px;
  background: #1d9fb8;
  padding: 4px;
`

const AuthorSection = styled.div`
  background: #f4f5f6;
  padding: 12px 50px 8px 50px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 30px 12px 6px 12px;
  }
`
const AuthorTag = styled.p`
  color: #000;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
`
const Author = styled.p`
  color: #000;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
`
const PublishedTime = styled.p`
  color: #808080;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  margin-top: 8px;
`

export default function PodcastCard({
  podcast,
  onPodcastSelect,
  listeningPodcast,
}) {
  const [showModal, setShowModal] = useState(false)

  const openModal = () => {
    setShowModal(true)
    onPodcastSelect(podcast)
  }

  const closeModal = () => {
    setShowModal(false)
  }
  const inputDate = podcast.published
  const formattedDate = dayjs(inputDate, 'DD/MM/YYYY, HH:mm:ss').format(
    'ddd, DD MMM YYYY HH:mm:ss'
  )

  const customImageObject = {
    original: podcast.heroImage,
  }

  return (
    <CardContainer onClick={openModal}>
      <BlueBar />
      <ImageWrapper>
        <CustomImage
          loadingImage="/images-next/loading.gif"
          defaultImage="/images-next/default-og-img.png"
          images={customImageObject}
          rwd={{
            mobile: '284px',
            tablet: '284px',
            desktop: '323px',
            default: '323px',
          }}
        />
        <Overlay
          // @ts-ignore
          listeningPodcast={
            listeningPodcast && listeningPodcast.guid === podcast.guid
          }
        />
      </ImageWrapper>
      <IntroSection>
        <Title>{podcast.title}</Title>
        <DurationIntroWrapper>
          <Duration>{podcast.duration}</Duration>
          <Intro>節目介紹</Intro>
        </DurationIntroWrapper>
      </IntroSection>
      <AuthorSection>
        <AuthorTag>主持人</AuthorTag>
        <Author>{podcast.author}</Author>
        <PublishedTime>{formattedDate}</PublishedTime>
      </AuthorSection>

      {/* Modal display logic */}
      {showModal && <PodcastModal podcast={podcast} onClose={closeModal} />}
    </CardContainer>
  )
}
