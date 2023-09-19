import { Fragment } from 'react'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import TopicListItem from './topic-list-item'
import { needInsertMicroAdAfter, getMicroAdUnitId } from '../../../utils/ad'
import { useDisplayAd } from '../../../hooks/useDisplayAd'

const GPTAd = dynamic(() => import('../../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const StyledMicroAd = dynamic(
  () => import('../../../components/ads/micro-ad/micro-ad-with-label'),
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

const StyledGPTAd = styled(GPTAd)`
  width: 100%;
  height: auto;
  margin: 20px auto;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 35px auto;
  }
`

/**
 * @typedef {import('./topic-list-item').Topic} Topic
 */

/**
 * @param {Object} props
 * @param {Topic[]} props.renderList
 * @returns {React.ReactElement}
 */
export default function TopicList({ renderList }) {
  const shouldShowAd = useDisplayAd()

  const renderListWithAd = shouldShowAd
    ? renderList.slice(0, 9)
    : renderList.slice(0, 12)

  const renderListWithoutAd = shouldShowAd
    ? renderList.slice(9)
    : renderList.slice(12)

  return (
    <>
      <ItemContainer>
        {renderListWithAd.map((item, index) => (
          <Fragment key={item.id}>
            <TopicListItem item={item} key={`topic-list-${item.id}`} />
            {shouldShowAd && needInsertMicroAdAfter(index) && (
              <StyledMicroAd
                unitId={getMicroAdUnitId(index, 'LISTING', 'RWD')}
                microAdType="LISTING"
                key={`topic-ad-${item.id}`}
              />
            )}
          </Fragment>
        ))}
      </ItemContainer>

      {shouldShowAd && <StyledGPTAd pageKey="other" adKey="FT" />}

      <ItemContainer>
        {renderListWithoutAd.map((item) => (
          <TopicListItem key={item.id} item={item} />
        ))}
      </ItemContainer>
    </>
  )
}
