import styled from 'styled-components'
import dynamic from 'next/dynamic'
import PremiumArticleListItem from './premium-article-list-item'
import { useDisplayAd } from '../../hooks/useDisplayAd'
import { SECTION_IDS } from '../../constants/index'

const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

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
    grid-template-columns: repeat(3, 320px);
    gap: 32px 32px;
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
 * @typedef {import('./premium-article-list-item').Article} Article
 * @typedef {import('./premium-article-list-item').Section} Section
 */

/**
 * @param {Object} props
 * @param {Article[]} props.renderList
 * @param {Section} [props.section]
 * @returns {React.ReactElement}
 */
export default function PremiumArticleList({ renderList, section }) {
  const { shouldShowAd } = useDisplayAd()

  const renderListBeforeAd = renderList.slice(0, 12)
  const renderListAfterAd = renderList.slice(12)

  return (
    <>
      <ItemContainer>
        {renderListBeforeAd.map((item) => (
          <PremiumArticleListItem key={item.id} item={item} section={section} />
        ))}
      </ItemContainer>

      {shouldShowAd && (
        <StyledGPTAd pageKey={SECTION_IDS['member']} adKey="FT" />
      )}

      <ItemContainer>
        {renderListAfterAd.map((item) => (
          <PremiumArticleListItem key={item.id} item={item} section={section} />
        ))}
      </ItemContainer>
    </>
  )
}
