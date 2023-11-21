import styled from 'styled-components'

const HeroWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 67.18vw;
  position: relative;
  display: flex;
  justify-content: center;
  amp-img img {
    object-fit: contain;
  }
  amp-video video {
    object-fit: contain;
  }
`

const HeroCaption = styled.figcaption`
  margin-top: 12px;
  padding: 0 20px;
  font-size: 14px;
  line-height: 180%;
  text-align: justify;
  color: rgba(0, 0, 0, 0.5);
`

/**
 * @typedef {import('../../apollo/fragments/post').HeroImage &
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
 * @typedef {import('../../apollo/fragments/video').HeroVideo } HeroVideo
 */

/**
 * Component for rending hero image of hero video.
 * @param {Object} props
 * @param {HeroImage | null} props.heroImage - The hero image data.
 * @param {HeroVideo | null} props.heroVideo - The hero video data.
 * @param {string} props.heroCaption - The caption for the hero image or video.
 * @param {string} [props.title] - The title of the article. Optional, only render if `props.style` is wide
 * @returns {JSX.Element | null}
 */
export default function AmpHero({
  heroVideo = null,
  heroImage = null,
  heroCaption = '',
  title = '',
}) {
  const shouldShowHeroVideo = Boolean(heroVideo)
  const shouldShowHeroImage = Boolean(heroImage)
  const shouldShowHeroCaption =
    heroCaption && (shouldShowHeroVideo || shouldShowHeroImage)

  const heroJsx = () => {
    const imageAlt = heroCaption ? heroCaption : title
    if (shouldShowHeroVideo) {
      return (
        <HeroWrapper>
          {/** @ts-ignore */}
          <amp-video
            controls
            layout="fill"
            poster={heroVideo?.heroImage?.resized?.original}
            src={heroVideo.videoSrc}
            title={imageAlt}
          />
        </HeroWrapper>
      )
    } else if (shouldShowHeroImage) {
      /**
       * The rules for fallback of the heroImage:
       * 1. Show w800 first.
       * 2. If the URL of w800 is an empty string or an invalid URL, then show the original by using <amp-img> with `fallback` attribute.
       * 3. If the URL of original is an empty string, then show the default image url by replacing src of <amp-img>.
       */
      return (
        <HeroWrapper>
          {/** @ts-ignore */}
          <amp-img src={heroImage?.resized?.w800} alt={imageAlt} layout="fill">
            {/** @ts-ignore */}
            <amp-img
              fallback=""
              src={
                heroImage?.resized?.original
                  ? heroImage?.resized?.original
                  : '/images-next/default-og-img.png'
              }
              alt={imageAlt}
              layout="fill"
            ></amp-img>
          </amp-img>
        </HeroWrapper>
      )
    }
    return (
      <HeroWrapper>
        {/** @ts-ignore */}
        <amp-img
          src="/images-next/default-og-img.png"
          alt={imageAlt}
          layout="fill"
        ></amp-img>
      </HeroWrapper>
    )
  }

  return (
    <figure>
      {heroJsx()}
      {shouldShowHeroCaption && <HeroCaption>{heroCaption}</HeroCaption>}
    </figure>
  )
}
