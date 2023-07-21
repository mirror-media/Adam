//REMINDER: DO NOT REMOVE className which has prefix `GTM-`, since it is used for collecting data of Google Analytics event.

import styled from 'styled-components'
import Link from 'next/link'
import CustomImage from '@readr-media/react-image'

/**
 * @typedef {import('../type/theme').Theme} Theme
 */

const ItemWrapper = styled.article`
  display: flex;
  width: 288px;
  margin: 0 auto;
  padding: 15px 0;
  border-bottom: 1px solid #b8b8b8;
  ${({ theme }) => theme.breakpoint.md} {
    position: relative;
    margin: 0;
    width: 244px;
    padding: 0;
    bottom: unset;
  }
`
const ImageContainer = styled.div`
  position: relative;
  height: 134px;
  width: 134px;
  ${({ theme }) => theme.breakpoint.md} {
    width: 244px;
    height: 244px;
  }
`
const Detail = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 20px;
  ${({ theme }) => theme.breakpoint.md} {
    position: absolute;
    bottom: 0;
    z-index: 1;
    padding-left: 0;
  }
`

const Label = styled.div`
  width: fit-content;
  height: 36px;
  padding: 8px 10px;
  text-align: center;
  color: white;
  font-size: 18px;
  line-height: 20px;
  font-weight: 400;
  background-color: ${
    /**
     * @param {Object} props
     * @param {String } props.sectionName
     * @param {Theme} [props.theme]
     */
    ({ sectionName, theme }) =>
      sectionName && theme.color.sectionsColor[sectionName]
        ? theme.color.sectionsColor[sectionName]
        : theme.color.brandColor.lightBlue
  };

  ${({ theme }) => theme.breakpoint.md} {
    font-weight: 300;
  }
`
const Title = styled.div`
  text-align: left;
  width: 134px;
  font-size: 18px;
  line-height: 1.3;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.66);
  h3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  ${({ theme }) => theme.breakpoint.md} {
    width: 244px;
    font-size: 16px;
    line-height: 27px;
    font-weight: 300;
    color: white;
    background-color: rgba(5, 79, 119, 0.8);
    padding: 10px;
    h3 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
`

/**
 * @typedef {Object} FormattedArticle
 * @property {string} articleHref
 * @property {string} sectionTitle
 * @property {string} sectionName
 * /




/**
 * @typedef {Pick<import('../apollo/fragments/post').Post, 'slug' | 'title' | 'style'| 'publishedDate' | 'heroImage' |'sections' | 'categories'  |'redirect'> & { partner: import('../apollo/fragments/partner').Partner | string}} ArticleRawData
 */

/**
 * @typedef {ArticleRawData &  FormattedArticle} Article
 */

/**
 * @param {Object} props
 * @param {Article} props.itemData
 * @returns {React.ReactElement}
 */
export default function LatestNewsItem({ itemData }) {
  return (
    <Link
      href={itemData.articleHref}
      target="_blank"
      rel="noreferrer"
      className="GTM-homepage-latest-list"
    >
      <ItemWrapper>
        <ImageContainer>
          <CustomImage
            defaultImage="/images/default-og-img.png"
            loadingImage="images/loading.gif"
            images={itemData.heroImage?.resized ?? {}}
            objectFit="cover"
            rwd={{
              mobile: '488px',
              tablet: '488px',
              desktop: '488px',
              default: '488px',
            }}
            alt={itemData.title}
          ></CustomImage>
        </ImageContainer>
        <Detail>
          {itemData.sectionTitle && (
            <Label sectionName={itemData.sectionTitle}>
              {itemData.sectionName}
            </Label>
          )}
          <Title>
            <h3>{itemData.title}</h3>
          </Title>
        </Detail>
      </ItemWrapper>
    </Link>
  )
}
