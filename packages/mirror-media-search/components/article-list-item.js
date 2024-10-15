import styled from 'styled-components'
import Image from '@readr-media/react-image'
import gtag from '../utils/programmable-search/gtag'
import { useEffect, useState } from 'react'
import { transformTimeData } from '../utils/programmable-search/date'

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

const ItemSection = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 8px;
  color: white;
  font-size: 16px;
  font-weight: 300;
  background-color: ${
    /**
     * @param {Object} props
     * @param {String } props.sectionSlug
     * @param {Theme} [props.theme]
     */
    ({ sectionSlug, theme }) =>
      sectionSlug && theme.color.sectionsColor[sectionSlug]
        ? theme.color.sectionsColor[sectionSlug]
        : theme.color.brandColor.lightBlue
  };
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
    font-weight: 600;
    padding: 4px 20px;
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
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    height: 75px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 18px;
  }
`

const ItemBrief = styled.div`
  font-size: 16px;
  color: #979797;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  ${({ date }) => {
    return `margin-top: ${date ? '8px' : '20px'};`
  }}

  ${({ theme }) => theme.breakpoint.md} {
    ${({ date }) => {
      return `margin-top: ${date ? '8px' : '16px'};`
    }}
  }

  ${({ theme }) => theme.breakpoint.xl} {
    ${({ date }) => {
      return `margin-top: ${date ? '8px' : '20px'};`
    }}
    -webkit-line-clamp: 4;
  }
`

const DateInfo = styled.div`
  color: #9cb7c6;
  font-family: 'PingFang TC';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  margin-top: 8px;
`

export default function ArticleListItem({ item, index, searchTerms }) {
  const publishedTime = item?.pagemap?.metatags?.[0]?.['article:published_time']
  const date = transformTimeData(publishedTime, 'dot')
  const [articleSection, setArticleSection] = useState({
    name: item?.pagemap?.metatags?.[0]?.['section:name'],
    slug: item?.pagemap?.metatags?.[0]?.['section:slug'],
  })
  useEffect(() => {
    if (item?.link) {
      const urlObject = new URL(item?.link)
      if (urlObject.pathname.startsWith('/campaigns/')) {
        setArticleSection({
          name: '活動網站',
          slug: 'campaign',
        })
      } else if (urlObject.pathname.startsWith('/projects/')) {
        setArticleSection({
          name: '專題',
          slug: 'project',
        })
      }
    }
  }, [item?.link])

  const onClickHandler = () => {
    if (index > 8) return
    const order = [
      'first',
      'second',
      'third',
      'fourth',
      'fifth',
      'sixth',
      'seventh',
      'eighth',
      'ninth',
    ][index]
    gtag.sendGAEvent(`search-${searchTerms}-click-${order}-post`)
  }
  return (
    <ItemWrapper href={item?.link} target="_blank" onClick={onClickHandler}>
      <ImageContainer>
        <Image
          images={{ original: item?.pagemap?.metatags?.[0]?.['og:image'] }}
          alt={item?.title}
          loadingImage="/images/loading.gif"
          defaultImage="/images/default-og-img.png"
        />
        {articleSection.name && (
          <ItemSection sectionSlug={articleSection.slug}>
            {articleSection.name}
          </ItemSection>
        )}
      </ImageContainer>
      <ItemDetail>
        <ItemTitle>{item?.title}</ItemTitle>
        {date && <DateInfo>{date}</DateInfo>}
        <ItemBrief date={date}>
          {item?.pagemap?.metatags?.[0]?.['og:description'] ?? ''}
        </ItemBrief>
      </ItemDetail>
    </ItemWrapper>
  )
}
