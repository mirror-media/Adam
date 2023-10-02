import styled from 'styled-components'
import Image from '@readr-media/react-image'
import gtag from '../utils/programmable-search/gtag'

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
     * @param {String } props.sectionName
     * @param {Theme} [props.theme]
     */
    ({ sectionName, theme }) =>
      sectionName && theme.color.sectionsColor[sectionName]
        ? theme.color.sectionsColor[sectionName]
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

export default function ArticleListItem({ item, index, searchTerms }) {
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
    <ItemWrapper href={item.link} target="_blank" onClick={onClickHandler}>
      <ImageContainer>
        <Image
          images={{ original: item.pagemap.cse_image[0].src }}
          alt={item.title}
          loadingImage="/images/loading.gif"
          defaultImage="/images/default-og-img.png"
        />
        <ItemSection
          sectionName={item.pagemap?.metatags[0]['section-name'] ?? 'member'}
        >
          {item.pagemap?.metatags[0]['article:section'] ?? '會員專區'}
        </ItemSection>
      </ImageContainer>
      <ItemDetail>
        <ItemTitle>{item.title}</ItemTitle>
        <ItemBrief>
          {item.pagemap?.metatags[0]['og:description'] ?? ''}
        </ItemBrief>
      </ItemDetail>
    </ItemWrapper>
  )
}
