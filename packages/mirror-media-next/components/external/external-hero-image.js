import CustomImage from '@readr-media/react-image'
import styled from 'styled-components'

const Wrapper = styled.figure`
  margin: 20px 0 0;
  ${({ theme }) => theme.breakpoint.md} {
    margin: 0 0 34px;
  }
`

const HeroImage = styled.figure`
  position: relative;
  width: 100%;
  height: 58.75vw;
  .readr-media-react-image {
    object-position: center center;
  }

  ${({ theme }) => theme.breakpoint.md} {
    width: 640px;
    height: 428px;
  }
`

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
 * @typedef {import('../../apollo/fragments/photo').Resized} Resized
 */
/**
 * @param {Object} props
 * @param {Resized | null} props.images
 * @param {string} props.title
 * @param {string} [props.thumbCaption]
 * @param {string} [props.className]
 * @returns
 */
export default function ExternalHeroImage({
  images = null,
  title = '',
  className = '',
  thumbCaption = '',
}) {
  return (
    <Wrapper className={className}>
      <HeroImage>
        <CustomImage
          images={images}
          loadingImage={'/images-next/loading@4x.gif'}
          defaultImage={'/images-next/default-og-img.png'}
          alt={title}
          objectFit={'cover'}
          priority={true}
        />
      </HeroImage>
      {!!thumbCaption && <HeroCaption>{thumbCaption}</HeroCaption>}
    </Wrapper>
  )
}
