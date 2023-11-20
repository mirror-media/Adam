import styled, { css } from 'styled-components'
import CustomImage from '@readr-media/react-image'
import { defaultSerifFontFamily } from '../../../styles/shared-style'
/**
 * @typedef {Pick<import('../../../apollo/fragments/post').HeroImage ,'id' | 'resized' | 'resizedWebp'>} HeroImage
 */

/**
 * @typedef {import('../../../apollo/fragments/video').HeroVideo } HeroVideo
 */
const heroCssWide = css`
  object-position: center center;
`
const heroCssPremium = css`
  margin: 0 auto;
  max-width: 1200px;
  max-height: 800px;
  object-position: center center;
`

const TitleWrapper = styled.section`
  margin: 20px 10px 0;
  max-width: 800px;
  width: auto;
  ${({ theme }) => theme.breakpoint.md} {
    position: absolute;
    left: 50%;
    bottom: calc(100% - 100vh);
    transform: translate(-50%, 0%);
    margin: 0 auto;
    width: 90vw;
    margin-bottom: 10vh;
    max-width: 800px;
  }
`
const ArticleTitle = styled.h1`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  ${defaultSerifFontFamily};
  font-weight: 700;
  text-align: center;
  display: block;
  ${({ theme }) => theme.breakpoint.md} {
    color: rgba(255, 255, 255, 0.87);
    font-size: 36px;
    line-height: 52px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 40px;
    line-height: 1.5;
  }
`

const ArticleSubtitle = styled.h2`
  color: #717171;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
  ${defaultSerifFontFamily};
  text-align: center;
  margin: 0.3rem;
  ${({ theme }) => theme.breakpoint.md} {
    ${defaultSerifFontFamily};
    color: #c1c1c1;
    font-size: 28px;
    font-weight: 400;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    ${defaultSerifFontFamily};
    font-size: 32px;
    line-height: 1.5;
  }
`

const Figure = styled.figure`
  margin: 0 0 0;
  height: 100%;
  position: relative;
  video {
    ${({ isStyleWide }) =>
      isStyleWide ? `${heroCssWide}` : `${heroCssPremium}`}
  }
  .readr-media-react-image {
    ${({ isStyleWide }) =>
      isStyleWide ? `${heroCssWide}` : `${heroCssPremium}`}
  }
  .empty {
    ${heroCssWide}
  }
  ${
    /**
     * @param {Object} param
     * @param {boolean} param.isStyleWide
     */
    ({ isStyleWide }) =>
      isStyleWide &&
      `&::after {
      content: ' ';
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100vh;
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0.15)
      );
    }`
  }
  ${({ theme }) => theme.breakpoint.md} {
    margin: 0 0 0;
  }
`
const Empty = styled.div`
  margin: 0 0 0;
  width: 100%;
  height: 100vh;
  background-color: #d9d9d9;
`
const HeroCaption = styled.figcaption`
  display: block;
  margin-top: 12px;
  font-size: 12px;
  line-height: 1.8;
  font-weight: 400;
  color: #9f9f9f;
  margin: 12px auto 0;
  padding: 0 20px;
  max-width: 680px;
  text-align: center;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 14px;
  }
`
const Video = styled.video`
  object-fit: cover;
  height: 100vh;
  width: 100%;
`

/**
 * Component for rending hero image of hero video.
 * This component is currently used at story page wide and premium layout.
 * This component will change it style by `props.style`.
 * If `props.style` is `wide`, component will render style for story page wide layout.
 * If `props.style` is `premium`, component will render style for story page premium layout.
 * There are four difference between 'wide' and `premium`:
 * 1. In `wide`, there is a `<h1>` in middle of bottom of component. In `premium`, there is no `<h1>` have to render.
 * 2. In `wide`, there is a semitransparent mask above image or video. In `premium`, there is no `<h1>` have to render.
 * 3. In `wide`, there is full-size block with gray background if no image and video is selected.  In `premium`, there is no have to render a full-size block.
 * 3. In `wide`, height of hero-image and hero-video are `100vh`. In `premium`, height are `66.vw`, and max-width is `1200px`, max-height is `800px`.
 * @param {Object} props
 * @param {'wide' | 'premium'} [props.style] - The style of the component, it will change the components style by assigning different value.
 * @param {HeroImage | null} props.heroImage - The hero image data.
 * @param {HeroVideo | null} props.heroVideo - The hero video data.
 * @param {string} props.heroCaption - The caption for the hero image or video.
 * @param {string} [props.title] - The title of the article. Optional, only render if `props.style` is wide
 * @param {string} [props.subtitle] - The subtitle of the article
 * @returns {JSX.Element}
 */
export default function HeroImageAndVideo({
  heroImage = null,
  heroVideo = null,
  heroCaption = '',
  title = '',
  style = 'wide',
  subtitle = '',
}) {
  const shouldShowHeroVideo = Boolean(heroVideo)
  const shouldShowHeroImage = Boolean(!shouldShowHeroVideo && heroImage)

  const getHeroJsx = () => {
    if (shouldShowHeroVideo) {
      return (
        <Video
          preload="metadata"
          controlsList="nodownload"
          playsInline={true}
          autoPlay={true}
          muted={true}
          loop={true}
          poster={heroVideo?.heroImage?.resized?.original}
          src={heroVideo.videoSrc}
        />
      )
    } else if (shouldShowHeroImage) {
      return (
        <CustomImage
          images={heroImage.resized}
          imagesWebP={heroImage.resizedWebp}
          loadingImage={'/images-next/loading@4x.gif'}
          defaultImage={'/images-next/default-og-img.png'}
          alt={heroCaption ? heroCaption : title}
          objectFit={'cover'}
          width={'100%'}
          height={style === 'wide' ? '100vh' : '66.67vw'}
          rwd={{ mobile: '100vw', default: '100vw' }}
          priority={true}
        />
      )
    }
    return null
  }
  const heroJsx = getHeroJsx()
  return (
    <>
      {shouldShowHeroImage || shouldShowHeroVideo ? (
        <Figure isStyleWide={style === 'wide'}>
          {heroJsx}
          {heroCaption ? <HeroCaption>{heroCaption}</HeroCaption> : null}
        </Figure>
      ) : (
        <>{style === 'wide' ? <Empty /> : null}</>
      )}
      {style === 'wide' && (title || subtitle) ? (
        <TitleWrapper>
          <ArticleTitle>{title}</ArticleTitle>
          <ArticleSubtitle>{subtitle}</ArticleSubtitle>
        </TitleWrapper>
      ) : null}
    </>
  )
}
