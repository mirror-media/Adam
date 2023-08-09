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

/**
 * @typedef {import('../../apollo/fragments/photo').Resized} Resized
 */
/**
 * @param {Object} props
 * @param {Resized | null} props.images
 * @param {string} props.title
 * @param {string} [props.className]
 * @returns
 */
export default function ExternalHeroImage({
  images = null,
  title = '',
  className = '',
}) {
  return (
    <Wrapper className={className}>
      <HeroImage>
        <CustomImage
          images={images}
          loadingImage={'/images/loading@4x.gif'}
          defaultImage={'/images/default-og-img.png'}
          alt={title}
          objectFit={'cover'}
          priority={true}
        />
      </HeroImage>
    </Wrapper>
  )
}
