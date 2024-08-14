//REMINDER: DO NOT REMOVE className which has prefix `GTM-`, since it is used for collecting data of Google Analytics event.

import styled from 'styled-components'
import Link from 'next/link'
import CustomImage from '@readr-media/react-image'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const ItemWrapper = styled.article`
  width: 100dvw;
  :hover {
    cursor: pointer;
    h3 {
      text-decoration: underline;
    }
  }
  ${({ theme }) => theme.breakpoint.md} {
    width: 100%;
  }
`
const ImageContainer = styled.div`
  position: relative;
  width: 100dvw;
  height: 62.5dvw;
  ${({ theme }) => theme.breakpoint.md} {
    width: calc((1024px - 48px * 2) / 3);
    height: calc((1024px - 48px * 2) / 3 * (184 / 276));
  }
`

const Label = styled.div`
  width: fit-content;
  height: fit-content;
  position: absolute;
  top: 0;
  left: 0;
  padding: 2px 10px;
  text-align: center;
  color: white;
  font-size: 14px;
  font-weight: 500;
  background-color: ${
    /**
     * @param {Object} props
     * @param {String} props.sectionSlug
     * @param {Theme} [props.theme]
     */
    ({ sectionSlug, theme }) => {
      if (sectionSlug === 'external') {
        return theme.color.sectionsColor['news']
      }
      return sectionSlug && theme.color.sectionsColor[sectionSlug]
        ? theme.color.sectionsColor[sectionSlug]
        : theme.color.brandColor.lightBlue
    }
  };
`

const Title = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-family: 'Noto Sans TC';
  font-size: 18px;
  font-style: normal;
  line-height: 150%;
  padding: 16px 12px 0 12px;
  h3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  ${({ theme }) => theme.breakpoint.md} {
    padding: 16px 0px 0 0px;
  }
`

/** @typedef {import('../../apollo/fragments/post').AsideListingPost} ArticleData */
/** @typedef {ArticleData & {sectionsWithOrdered: ArticleData["sectionsInInputOrder"]} } ArticleDataContainSectionsWithOrdered */

/**
 * @param {Object} props
 * @param {ArticleDataContainSectionsWithOrdered} props.itemData
 * @returns {React.ReactElement}
 */
export default function PopularNewsItem({ itemData }) {
  const firstSection =
    itemData.sectionsWithOrdered?.[0] || itemData.sections?.[0]

  return (
    <Link
      href={`/story/${itemData.slug}`}
      target="_blank"
      rel="noreferrer"
      className="GTM-homepage-popular-list"
    >
      <ItemWrapper>
        <ImageContainer>
          <CustomImage
            defaultImage="/images-next/default-og-img.png"
            loadingImage="images-next/loading.gif"
            images={itemData.heroImage?.resized}
            objectFit="cover"
            rwd={{
              mobile: '488px',
              tablet: '488px',
              desktop: '488px',
              default: '488px',
            }}
            alt={itemData.title}
          ></CustomImage>
          {firstSection?.slug && (
            <Label sectionSlug={firstSection.slug}>{firstSection.name}</Label>
          )}
        </ImageContainer>
        <Title>
          <h3>{itemData.title}</h3>
        </Title>
      </ItemWrapper>
    </Link>
  )
}
