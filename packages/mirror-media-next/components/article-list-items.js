import styled from 'styled-components'
import ArticleListItem from './article-list-item'

const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: 320px;
  justify-content: center;
  row-gap: 20px;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(2, 320px);
    gap: 20px 32px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: repeat(4, 220px);
    gap: 36px 48px;
  }
`

/**
 * @param {Object} props
 * @param {import('../type/shared/article').Article[]} props.renderList
 * @param {import('../type/category').CategorySection} [props.section]
 * @returns {React.ReactElement}
 */
export default function ArticleListItems({ renderList, section }) {
  return (
    <ItemContainer>
      {renderList.map((item) => (
        <ArticleListItem key={item.id} item={item} section={section} />
      ))}
    </ItemContainer>
  )
}
