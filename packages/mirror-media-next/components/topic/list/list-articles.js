import styled from 'styled-components'
import ListArticlesItem from './list-articles-item'

const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: 320px;
  justify-content: center;
  row-gap: 28px;
  margin: 28px 0;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(3, 220px);
    gap: 36px 20px;
    margin: 32px 0;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: repeat(4, 220px);
    gap: 36px 48px;
    margin: 40px 0;
  }
`

/**
 * @typedef {import('./list-articles-item').Article} Article
 */

/**
 * @param {Object} props
 * @param {Article[]} props.renderList
 * @returns {React.ReactElement}
 */
export default function ListArticles({ renderList }) {
  return (
    <ItemContainer className="itemContainer">
      {renderList.map((item) => (
        <ListArticlesItem key={item.id} item={item} />
      ))}
    </ItemContainer>
  )
}
