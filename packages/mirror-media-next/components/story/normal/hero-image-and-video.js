import CustomImage from '@readr-media/react-image'
import styled from 'styled-components'
import Image from 'next/image'
import defaultImage from '../../../public/images-next/default-og-img.png'
/**
 * @typedef {Pick<import('../../../apollo/fragments/post').HeroImage ,'id' | 'resized' | 'resizedWebp' | "imageFile">} HeroImage
 */

/**
 * @typedef {import('../../../apollo/fragments/video').HeroVideo } HeroVideo
 */

const Wrapper = styled.figure`
  margin: 20px 0 0;
  ${({ theme }) => theme.breakpoint.md} {
    margin: 0 0 34px;
  }
`

/**
 * @typedef {Object} HeroImageProps
 * @property {number} [$imgWidth] - Original image width
 * @property {number} [$imgHeight] - Original image height
 */

/** @type {import('styled-components').StyledComponent<'figure', any, HeroImageProps , never>} */
const HeroImage = styled('figure')(
  /**
   * @param {HeroImageProps & { theme: import('../../../styles/theme/media').Theme }} props
   */
  ({ $imgWidth, $imgHeight, theme }) => `
    position: relative;
    width: 100%;
    aspect-ratio: ${
      Number($imgWidth) > 0 && Number($imgHeight) > 0
        ? `${Number($imgWidth)} / ${Number($imgHeight)}`
        : '16 / 9'
    };
    overflow: hidden;

    .readr-media-react-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center center;
    }

    @media ${theme.breakpoint.md} {
      width: 640px;
    }
  `
)

const HeroCaption = styled.figcaption`
  width: 100%;
  min-height: 22px;
  margin-top: 24px;
  font-size: 14px;
  line-height: 25px;
  font-weight: 400;
  color: #9d9d9d;
  position: relative;
  text-align: center;
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    top: -12px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.1);
  }

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 9px;
    font-size: 18px;
    font-weight: 600;
    text-align: left;

    &:before {
      display: none;
    }
  }
`
/**
 *
 * @param {Object} props
 * @param {HeroImage | null} props.heroImage
 * @param {HeroVideo | null} props.heroVideo
 * @param {string} props.heroCaption
 * @param {string} props.title
 * @param {string} [props.className]
 * @returns
 */
export default function HeroImageAndVideo({
  heroImage = null,
  heroVideo = null,
  heroCaption = '',
  title = '',
  className = '',
}) {
  const shouldShowHeroVideo = Boolean(heroVideo)
  const shouldShowHeroImage = Boolean(!shouldShowHeroVideo && heroImage)

  const heroJsx = () => {
    if (shouldShowHeroVideo) {
      return (
        /* The CMS HeroVideo payload does not include a caption track URL. */
        /* eslint-disable-next-line jsx-a11y/media-has-caption */
        <video
          preload="metadata"
          controlsList="nodownload"
          playsInline={true}
          controls={true}
          poster={heroVideo?.heroImage?.resized?.original}
          src={heroVideo.videoSrc}
        />
      )
    } else if (shouldShowHeroImage) {
      return (
        <HeroImage
          $imgWidth={heroImage?.imageFile?.width}
          $imgHeight={heroImage?.imageFile?.height}
        >
          <CustomImage
            images={heroImage.resized}
            imagesWebP={heroImage.resizedWebp}
            defaultImage={'/images-next/default-og-img.png'}
            alt={heroCaption ? heroCaption : title}
            objectFit={'contain'}
            priority
            fetchPriority="high"
          />
        </HeroImage>
      )
    }
    return (
      <Image src={defaultImage} alt={heroCaption ? heroCaption : title}></Image>
    )
  }
  const shouldShowHeroCaption =
    heroCaption && (shouldShowHeroVideo || shouldShowHeroImage)
  return (
    <Wrapper className={className}>
      {heroJsx()}
      {shouldShowHeroCaption && (
        <HeroCaption>{shouldShowHeroCaption ? heroCaption : null}</HeroCaption>
      )}
    </Wrapper>
  )
}
