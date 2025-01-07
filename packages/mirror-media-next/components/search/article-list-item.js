import styled from 'styled-components'
import Image from '@readr-media/react-image'
// import gtag from '../utils/programmable-search/gtag'
import { transformTimeData } from '../../utils'

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

// const ItemSection = styled.div`
//   position: absolute;
//   left: 0;
//   bottom: 0;
//   padding: 8px;
//   color: white;
//   font-size: 16px;
//   font-weight: 300;
//   background-color: ${
//     /**
//      * @param {Object} props
//      * @param {String} props.sectionSlug
//      */
//     ({ sectionSlug, theme }) =>
//       sectionSlug && theme.color.sectionsColor[sectionSlug]
//         ? theme.color.sectionsColor[sectionSlug]
//         : theme.color.brandColor.lightBlue
//   };
//   ${({ theme }) => theme.breakpoint.md} {
//     font-size: 18px;
//     font-weight: 600;
//     padding: 4px 20px;
//   }
// `

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
  ${
    /**
     * @param {Object} props
     * @param {String} props.date - The date to determine the margin-top style.
     */
    ({ date }) => {
      return `margin-top: ${date ? '8px' : '20px'};`
    }
  }

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

/**
 * @param {Object} props
 * @param {number} props.index
 * @param {import('../../utils/api/search').Document} props.item
 */
export default function ArticleListItem({ item, index }) {
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
  ]
  const { derivedStructData, structData } = item
  const removeBoldTags = (text) => {
    return text.replace(/<\/?b>/g, '')
  }
  const renderedItem = {
    title: derivedStructData?.title ?? '',
    description: removeBoldTags(derivedStructData?.snippets?.[0]?.snippet),
    link: derivedStructData?.link ?? '',
    image: structData?.['page-image']?.[0] ?? null,
    publishedTime: transformTimeData(structData?.datePublished?.[0], 'dot'),
  }
  // const [articleSection, setArticleSection] = useState({
  //   name: item?.pagemap?.metatags?.[0]?.['section:name'],
  //   slug: item?.pagemap?.metatags?.[0]?.['section:slug'],
  // })
  // useEffect(() => {
  //   if (item?.link) {
  //     const urlObject = new URL(item?.link)
  //     if (urlObject.pathname.startsWith('/campaigns/')) {
  //       setArticleSection({
  //         name: '活動網站',
  //         slug: 'campaign',
  //       })
  //     } else if (urlObject.pathname.startsWith('/projects/')) {
  //       setArticleSection({
  //         name: '專題',
  //         slug: 'project',
  //       })
  //     }
  //   }
  // }, [item?.link])

  return (
    <ItemWrapper
      href={renderedItem?.link}
      target="_blank"
      className={index > 8 ? order[index] : ''}
    >
      <ImageContainer>
        <Image
          images={{ original: renderedItem.image }}
          alt={renderedItem.title}
          loadingImage="/images-next/loading.gif"
          defaultImage="/images-next/default-og-img.png"
        />
        {/* {articleSection.name && (
          <ItemSection sectionSlug={articleSection.slug}>
            {articleSection.name}
          </ItemSection>
        )} */}
      </ImageContainer>
      <ItemDetail>
        <ItemTitle>{renderedItem.title}</ItemTitle>
        {renderedItem.publishedTime && (
          <DateInfo>{renderedItem.publishedTime}</DateInfo>
        )}
        <ItemBrief date={renderedItem.publishedTime}>
          {renderedItem.description ?? ''}
        </ItemBrief>
      </ItemDetail>
    </ItemWrapper>
  )
}
