import styled from 'styled-components'
import Image from '@readr-media/react-image'

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

const ItemWrapper = styled.a`
  display: flex;
  position: relative;
  width: 300px;
  margin: 0 auto;
  font-size: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid #4a4a4a;
  column-gap: 12px;
  ${({ theme }) => theme.breakpoint.md} {
    flex-direction: column;
    width: 320px;
    padding-bottom: 36px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    padding-bottom: 40px;
    margin-bottom: -1px;
    &:nth-child(3n-1) {
      width: 384px;
      padding: 0 32px;
    }
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

const ItemDetail = styled.div`
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 20px;
  }
`

const ItemTitle = styled.h3`
  color: #b17f5a;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
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

  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 20px;
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
  return (
    <ItemWrapper
      href={`/story/${item.slug}`}
      target="_blank"
      className="groupArticleItem"
    >
      <ImageContainer>
        <Image
          images={item.heroImage?.resized}
          alt={item.title}
          loadingImage="/images/loading.gif"
          defaultImage="/images/default-og-img.png"
          rwd={{ tablet: '320px', desktop: '220px' }}
        />
      </ImageContainer>
      <ItemDetail className="groupListBlockContent">
        <ItemTitle>{item.title}</ItemTitle>
        <ItemBrief>{item.brief?.blocks[0]?.text}</ItemBrief>
      </ItemDetail>
    </ItemWrapper>
  )
}
