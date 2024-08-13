import Image from '@readr-media/react-image'
import styled from 'styled-components'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const LinkWrapper = styled.a`
  display: flex;
  img {
    min-width: 160px;
  }
`

const FigureCaption = styled.div`
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Label = styled.span`
  display: flex;
  width: fit-content;
  height: fit-content;
  padding: 8px;
  text-align: center;
  color: white;
  font-size: 14px;
  font-weight: 300;
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

const Title = styled.h3`
  color: #4a4a4a;
  text-align: justify;
  font-family: 'PingFang TC';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`

/** @typedef {import('../../apollo/fragments/post').AsideListingPost} ArticleData */
/** @typedef {ArticleData & {sectionsWithOrdered: ArticleData["sectionsInInputOrder"]} } ArticleDataContainSectionsWithOrdered */
/**
 *
 * @param {Object} props
 * @param {ArticleDataContainSectionsWithOrdered} props.item
 * @returns {JSX.Element}
 */
export default function PopularNewsItem({ item }) {
  const firstSection = item.sectionsWithOrdered?.[0] || item.sections?.[0]
  return (
    <LinkWrapper
      href={`/slug/${item.slug}`}
      target="_blank"
      className="article-image"
    >
      <Image
        images={item?.heroImage?.resized}
        alt={item.title}
        loadingImage={'/images-next/loading.gif'}
        defaultImage={'/images-next/default-og-img.png'}
        width={160}
        height={106}
      />

      <FigureCaption>
        {firstSection?.slug ? (
          <Label sectionSlug={firstSection.slug}>{firstSection.name}</Label>
        ) : (
          <div />
        )}
        <Title>{item.title}</Title>
      </FigureCaption>
    </LinkWrapper>
  )
}
