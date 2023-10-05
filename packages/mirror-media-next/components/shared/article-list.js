import { Fragment } from 'react'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import ArticleListItem from './article-list-item'
import { needInsertMicroAdAfter, getMicroAdUnitId } from '../../utils/ad'
import { useDisplayAd } from '../../hooks/useDisplayAd'
import { getSectionGPTPageKey } from '../../utils/ad'

const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

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

const StyledGPTAd = styled(GPTAd)`
  width: 100%;
  height: auto;
  margin: 20px auto;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 35px auto;
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
  const shouldShowAd = useDisplayAd()
  /**
   * 這個元件會被共用於 author/tag/category/section 列表頁
   * 在 author/tag 列表頁時，由於沒有section?.slug，函式 `getSectionGPTPageKey`會回傳 'other'
   * 在 section/category 列表頁時，GPT 廣告的 PageKey 設定為 'section.slug'
   * 若 category 無所屬的 section (related-Section)，函式 `getSectionGPTPageKey`會回傳 'other'
   */
  const gptAdPageKey = getSectionGPTPageKey(section?.slug)

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
            <ArticleListItem item={item} section={section} />
            {shouldShowAd && needInsertMicroAdAfter(index) && (
              <StyledMicroAd
                unitId={getMicroAdUnitId(index, 'LISTING', 'RWD')}
                microAdType="LISTING"
              />
            )}
          </Fragment>
        ))}
      </ItemContainer>

      {shouldShowAd && <StyledGPTAd pageKey={gptAdPageKey} adKey="FT" />}

      <ItemContainer>
        {renderListWithoutAd.map((item) => (
          <ArticleListItem key={item.id} item={item} section={section} />
        ))}
      </ItemContainer>
    </>
  )
}
