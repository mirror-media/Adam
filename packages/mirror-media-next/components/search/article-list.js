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
 * @param {import('../../utils/api/search').Document[]} props.renderList
 */
export default function ArticleList({ renderList }) {
  return (
    <ItemContainer>
      {renderList.map((item, index) => (
        <ArticleListItem
          key={item?.id + index || index}
          item={item}
          index={index}
        />
      ))}
    </ItemContainer>
  )
}
