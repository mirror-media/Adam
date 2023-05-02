import CustomImage from '@readr-media/react-image'
import styled from 'styled-components'
/**
 * @typedef {import('../../../apollo/fragments/post').HeroImage &
 * {
 *  id: string,
 *  resized: {
 *    original: string,
 *    w480: string,
 *    w800: string,
 *    w1200: string,
 *    w1600: string,
 *    w2400: string
 *  }
 * } } HeroImage
 */

/**
 * @typedef {import('../../../apollo/fragments/video').HeroVideo } HeroVideo
 */

const ArticleTitle = styled.h1`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-family: var(--notoserifTC-font);
  font-weight: 700;
  text-align: center;
  margin: 20px 10px 0;

  width: auto;
  max-width: 800px;
  ${({ theme }) => theme.breakpoint.md} {
    position: absolute;
    left: 50%;
    bottom: 18px;
    transform: translate(-50%, 0%);
    color: rgba(255, 255, 255, 0.87);
    margin: 0 auto;
    width: 90vw;
    font-size: 36px;
    line-height: 52px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    bottom: 60px;
    font-size: 40px;
    line-height: 1.5;
  }
`
const Wrapper = styled.section`
  ${({ theme }) => theme.breakpoint.md} {
    position: relative;
  }
`
const Figure = styled.figure`
  margin: 0 0 0;
  height: 100vh;
  background-color: #d9d9d9;
  position: relative;

  video {
    position: absolute;
    width: 100%;
    height: 100%;
    object-position: center center;
  }
  .readr-media-react-image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-position: center center;
  }
  ${({ theme }) => theme.breakpoint.md} {
    margin: 0 0 0;

    &::after {
      content: ' ';
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0.15)
      );
    }
  }
`

const HeroCaption = styled.figcaption`
  display: none;
`
/**
 *
 * @param {Object} props
 * @param {HeroImage | null} props.heroImage
 * @param {HeroVideo | null} props.heroVideo
 * @param {string} props.heroCaption
 * @param {string} props.title
 * @returns
 */
export default function HeroImageAndVideo({
  heroImage = null,
  heroVideo = null,
  heroCaption = '',
  title = '',
}) {
  const shouldShowHeroVideo = Boolean(heroVideo)
  const shouldShowHeroImage = Boolean(!shouldShowHeroVideo && heroImage)
  const heroJsx = () => {
    if (shouldShowHeroVideo) {
      return (
        <video
          preload="metadata"
          controlsList="nodownload"
          playsInline={true}
          controls={true}
          poster={heroVideo?.heroImage?.resized?.original}
          src={heroVideo.urlOriginal}
        />
      )
    } else if (shouldShowHeroImage) {
      return (
        <CustomImage
          images={heroImage.resized}
          loadingImage={'/images/loading@4x.gif'}
          defaultImage={'/images/default-og-img.png'}
          alt={heroCaption ? heroCaption : title}
          objectFit={'cover'}
          width={''}
          height={''}
          rwd={{ mobile: '100vw', default: '100vw' }}
          priority={true}
        />
      )
    }
    return null
  }

  return (
    <Wrapper>
      <Figure>
        {heroJsx()}
        <HeroCaption>{title}</HeroCaption>
      </Figure>
      <ArticleTitle>{title}</ArticleTitle>
    </Wrapper>
  )
}
