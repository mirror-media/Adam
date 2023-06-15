import { Fragment } from 'react'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import ArticleListItem from './article-list-item'
import { needInsertMicroAdAfter, getMicroAdUnitId } from '../../utils/ad'

const StyledMicroAd = dynamic(
  () => import('../../components/ads/micro-ad/micro-ad-with-label'),
  {
    ssr: false,
  }
)

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
  return (
    <ItemContainer>
      {renderList.map((item, index) => (
        <Fragment key={item.id}>
          <ArticleListItem item={item} section={section} />
          {needInsertMicroAdAfter(index) && (
            <StyledMicroAd
              unitId={getMicroAdUnitId(index, 'LISTING', 'RWD')}
              microAdType="LISTING"
            />
          )}
        </Fragment>
      ))}
    </ItemContainer>
  )
}
