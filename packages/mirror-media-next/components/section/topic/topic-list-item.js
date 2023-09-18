import styled from 'styled-components'
import Image from '@readr-media/react-image'
import { parseUrl } from '../../../utils/topic'

const ItemWrapper = styled.a`
  display: block;
  position: relative;
  width: 100%;
  margin: 0 auto;
  font-size: 18px;
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 214px;
  ${({ theme }) => theme.breakpoint.xl} {
    height: 147px;
  }
`

const ItemDetail = styled.div`
  margin: 20px 20px 36px 20px;
  ${({ theme }) => theme.breakpoint.md} {
    margin: 20px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 8px 8px 40px 8px;
  }
`

const ItemTitle = styled.div`
  color: #054f77;
  line-height: 25px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 18px;
  }
`

const ItemBrief = styled.div`
  font-size: 16px;
  color: #979797;
  margin-top: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 16px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 20px;
    -webkit-line-clamp: 4;
  }
`

/**
 * @typedef {import('../../../apollo/fragments/photo').Photo} HeroImage
 *
 * @typedef {import('../../../apollo/fragments/topic').Topic} Topic
 *
 */

/**
 * @param {Object} props
 * @param {Topic} props.item
 * @returns {React.ReactElement}
 */
export default function TopicListItem({ item }) {
  const images =
    item.og_image?.resized ||
    (parseUrl(item.style) ? { original: parseUrl(item.style) } : null) ||
    item.heroImage?.resized
  console.log('images', images)
  return (
    <ItemWrapper href={`/topic/${item.slug}`} target="_blank">
      <ImageContainer>
        <Image
          images={images}
          alt={item.name}
          loadingImage="/images-next/loading.gif"
          defaultImage="/images-next/default-og-img.png"
          rwd={{ tablet: '320px', desktop: '500px' }}
        />
      </ImageContainer>
      <ItemDetail>
        <ItemTitle>{item.name}</ItemTitle>
        <ItemBrief>{item.brief?.blocks[0]?.text}</ItemBrief>
      </ItemDetail>
    </ItemWrapper>
  )
}
