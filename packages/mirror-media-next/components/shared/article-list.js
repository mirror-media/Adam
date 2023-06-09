import styled from 'styled-components'
import ArticleListItem from './article-list-item'
import StyledMicroAd from '../../components/ads/micro-ad/micro-ad-with-label'
import { needInsertMicroAdAfter, getMicroAdUnitId } from '../../utils/ad'
import { useMembership } from '../../context/membership'

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
 * @typedef {import('./article-list-item').Article} Article
 * @typedef {import('./article-list-item').Section} Section
 */

/**
 * @param {Object} props
 * @param {Article[]} props.renderList
 * @param {Section} [props.section]
 * @returns {React.ReactElement}
 */
export default function ArticleList({ renderList, section }) {
  const { isLoggedIn } = useMembership()

  return (
    <ItemContainer>
      {renderList.map((item, index) => (
        <>
          <ArticleListItem key={item.id} item={item} section={section} />
          {!isLoggedIn && needInsertMicroAdAfter(index) && (
            <StyledMicroAd
              unitId={getMicroAdUnitId(index, 'LISTING', 'RWD')}
              microAdType="LISTING"
            />
          )}
        </>
      ))}
    </ItemContainer>
  )
}
