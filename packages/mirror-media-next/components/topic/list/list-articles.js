import styled from 'styled-components'
import ListArticlesItem from './list-articles-item'
import dynamic from 'next/dynamic'

import { useDisplayAd } from '../../../hooks/useDisplayAd'
const GPTAd = dynamic(() => import('../../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const StyledGPTAd = styled(GPTAd)`
  width: 100%;
  height: auto;
  margin: 0 auto 20px auto;
  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 970px;
    max-height: 250px;
    margin: 0 auto 35px auto;
  }
`

const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: 320px;
  justify-content: center;
  row-gap: 20px;
  margin-top: 40px;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(3, 220px);
    gap: 32px 10px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: repeat(4, 220px);
    gap: 48px;
  }
`

/**
 * @typedef {import('./list-articles-item').Article} Article
 */

/**
 * @param {Object} props
 * @param {Article[]} props.renderList
 * @param {string} props.dfp
 * @returns {React.ReactElement}
 */
export default function ListArticles({ renderList, dfp }) {
  const shouldShowAd = useDisplayAd()
  const renderListBeforeAd = renderList.slice(0, 12)
  const renderListAfterAd = renderList.slice(12)

  return (
    <>
      <ItemContainer>
        {renderListBeforeAd.map((item) => (
          <ListArticlesItem key={item.id} item={item} />
        ))}
      </ItemContainer>
      {shouldShowAd && dfp && <StyledGPTAd adUnit={dfp} />}
      <ItemContainer>
        {renderListAfterAd.map((item) => (
          <ListArticlesItem key={item.id} item={item} />
        ))}
      </ItemContainer>
    </>
  )
}
