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

export default function ArticleList({ renderList, searchTerms }) {
  return (
    <ItemContainer>
      {renderList.map((item, index) => (
        <ArticleListItem
          key={item.title}
          item={item}
          index={index}
          searchTerms={searchTerms}
        />
      ))}
    </ItemContainer>
  )
}
