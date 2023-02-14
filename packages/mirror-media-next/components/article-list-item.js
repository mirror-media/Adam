import styled from 'styled-components'

import CustomNextImage from './custom-next-image'

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
    margin: 21px 20px 20px 20px;
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
    font-weight: 600;
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
 * @param {Object} props
 * @param {import('../type/shared/article').Article} props.item
 * @param {import('../type/category').CategorySection} [props.section]
 * @returns {React.ReactElement}
 */
export default function ArticleListItem({ item, section }) {
  const itemSection =
    section || item.sections.find((section) => section.slug !== 'member')

  return (
    <ItemWrapper href={`/story/${item.slug}`} target="_blank">
      <ImageContainer>
        <CustomNextImage src={item.heroImage?.resized?.w800} />
        {itemSection && (
          <ItemSection sectionName={itemSection?.slug}>
            {itemSection?.name}
          </ItemSection>
        )}
      </ImageContainer>
      <ItemDetail>
        <ItemTitle>{item.title}</ItemTitle>
        <ItemBrief>{item.brief?.blocks[0]?.text}</ItemBrief>
      </ItemDetail>
    </ItemWrapper>
  )
}
