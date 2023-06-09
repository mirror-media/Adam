import styled from 'styled-components'
import ExternalListItem from './externals-list-item'
import { needInsertMicroAdAfter, getMicroAdUnitId } from '../../utils/ad'
import StyledMicroAd from '../../components/ads/micro-ad/micro-ad-with-label'
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
 * @typedef {import('../../apollo/fragments/external').ListingExternal} ListingExternal
 */

/**
 * @param {Object} props
 * @param {ListingExternal[]} props.renderList
 * @returns {React.ReactElement}
 */
export default function ExternalList({ renderList }) {
  const { isLoggedIn } = useMembership()

  return (
    <ItemContainer>
      {renderList.map((item, index) => (
        <>
          <ExternalListItem key={item.id} item={item} />
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
