import styled from 'styled-components'
import Image from '@readr-media/react-image'

import { transformTimeData } from '../../../utils'
import { color } from '../../../styles/theme/color'
import { normalizeImageForRender } from '../../../utils/image.mjs'

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

const ItemWrapper = styled.a`
  display: flex;
  gap: 12px;
  position: relative;
  width: 300px;
  margin: 0 auto;
  padding: 12px 0;
  font-size: 18px;
  border-bottom: 1px solid #4a4a4a;

  :first-child {
    padding-top: 0;
  }

  :last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: column;
    gap: 20px;
    width: 320px;
    padding: 0;
    border-bottom: none;
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 147px;
  height: 99px;
  flex: none;
  border-radius: 16px;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    width: 100%;
    height: 214px;
  }
`

const ItemDate = styled.div`
  color: ${color.brandColor.black};
  font-size: 14px;
  font-weight: 500;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 16px;
  }
`

// Empty for now, kept for consistency with topic page list-articles structure
const ItemDetail = styled.div``

const ItemTitle = styled.h2`
  color: #b17f5a;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  padding-top: 0 !important;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
    line-height: 26px;
    -webkit-line-clamp: 2;
    height: 52px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 18px;
  }
`

const ItemBrief = styled.p`
  display: none;

  ${({ theme }) => theme.breakpoint.md} {
    display: block;
    height: 72px;
    margin-top: 20px;
    font-size: 16px;
    line-height: 1.5;
    color: #4a4a4a;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`

/**
 * @typedef {import('../../../apollo/fragments/section').Section & {
 *  id: string,
 *  name: string,
 *  slug: string,
 * }} Section
 *
 * @typedef {import('../../../apollo/fragments/category').Category & {
 *  id: string,
 *  name: string,
 *  slug: string,
 * }} Category
 *
 * @typedef {import('../../../apollo/fragments/photo').Photo & {
 *  id: String,
 *  name: String,
 *  imageFile: import('../../../apollo/fragments/photo').ImageFile,
 *  resized: import('../../../apollo/fragments/photo').Resized
 * }} HeroImage
 *
 * @typedef {import('../../../apollo/fragments/tag').Tag} Tag
 * @typedef {import('../../../apollo/fragments/post').Post} Article
 */

/**
 * @param {Object} props
 * @param {Article} props.item
 * @returns {React.ReactElement}
 */
export default function GroupArticlesItem({ item }) {
  const { slug, heroImage, title, publishedDate, brief } = item
  const normalizedHeroImage = normalizeImageForRender(heroImage)

  return (
    <ItemWrapper
      href={`/story/${slug}`}
      target="_blank"
      className="groupArticleItem"
    >
      <ImageContainer>
        <Image
          images={normalizedHeroImage?.resized}
          imagesWebP={normalizedHeroImage?.resizedWebp}
          alt={title}
          loadingImage="/images-next/loading.gif"
          defaultImage="/images-next/default-og-img.png"
          rwd={{ mobile: '500px', tablet: '500px', laptop: '500px' }}
        />
      </ImageContainer>
      <ItemDetail className="groupListBlockContent">
        {publishedDate && (
          <ItemDate className="itemDate">
            {transformTimeData(publishedDate, 'slashWithTime')}
          </ItemDate>
        )}
        <ItemTitle>{title}</ItemTitle>
        <ItemBrief>{brief?.blocks[0]?.text}</ItemBrief>
      </ItemDetail>
    </ItemWrapper>
  )
}
