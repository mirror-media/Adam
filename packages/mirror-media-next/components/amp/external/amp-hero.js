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

/**
 * Component for rendering hero image of the external article.
 * @param {Object} props
 * @param {string} props.thumb - The image of the external article.
 * @param {string} [props.title] - The title of the external article.
 * @returns {JSX.Element}
 */
export default function AmpHero({ thumb, title = '' }) {
  const imageSrc = thumb || '/images-next/default-og-img.png'
  const imageAlt = title

  return (
    <figure>
      <HeroWrapper>
        {/** @ts-ignore */}
        <amp-img src={imageSrc} alt={imageAlt} layout="fill"></amp-img>
      </HeroWrapper>
    </figure>
  )
}
