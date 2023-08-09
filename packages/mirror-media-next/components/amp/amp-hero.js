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
  const shouldShowHeroImage = Boolean(!shouldShowHeroVideo && heroImage)
  if (!shouldShowHeroVideo && !shouldShowHeroImage) {
    return null
  }

  // TODO: add srcset and callback
  // const srcset = Object.entries(heroImage?.resized)
  //   .filter(([key, value]) => key !== 'original' && value !== '')
  //   .filter(([key, value]) => key !== '__typename')
  //   .map(([key, value]) => `${value} ${key.replace('w', '')}w`)
  //   .join(', ')

  return (
    <figure>
      {shouldShowHeroImage && (
        <HeroWrapper>
          {/** @ts-ignore */}
          <amp-img
            src={heroImage.resized?.original}
            alt={heroCaption ?? title}
            layout="fill"
          />
        </HeroWrapper>
      )}
      {shouldShowHeroVideo && (
        <HeroWrapper>
          {/** @ts-ignore */}
          <amp-video
            controls
            layout="fill"
            poster={heroVideo?.heroImage?.resized?.original}
            src={heroVideo.urlOriginal}
          />
        </HeroWrapper>
      )}
      {heroCaption && <HeroCaption>{heroCaption}</HeroCaption>}
    </figure>
  )
}
