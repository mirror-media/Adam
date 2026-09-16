import { Fragment } from 'react'
import dynamic from 'next/dynamic'

import { AD_MEDIA_QUERIES } from '@/components/ads/ad-breakpoints'
import { CompassFitAd } from '@/components/ads/compass-fit/compass-fit-ad'
import {
  COMPASS_FIT_UNITS,
  getCompassFitSlotIndex,
} from '@/components/ads/compass-fit/compass-fit-config'
import useMediaQuery from '@/hooks/use-media-query'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import { getSectionGPTPageKey } from '@/utils/ad'

import type {
  ArticleListItemData,
  ArticleListSection,
} from '../list-article-types'

import { ArticleListItem } from './article-list-item'
import { LeadArticle } from './lead-article'

const GPTAd = dynamic(() => import('@/components/ads/gpt/gpt-ad'), {
  ssr: false,
})

type ArticleListProps = {
  from?: string
  renderList: ArticleListItemData[]
  section?: ArticleListSection
}

export function ArticleList({ from, renderList, section }: ArticleListProps) {
  const { shouldShowAd } = useDisplayAd()
  const { isMediaQueryResolved: isListingViewportResolved, matches: isSmUp } =
    useMediaQuery(AD_MEDIA_QUERIES.listingLayoutSm)

  /**
   * 這個元件會被共用於 author/tag/category 列表頁
   * 在 author/tag 列表頁時，由於沒有 section?.slug，函式 `getSectionGPTPageKey` 會回傳 'other'
   * 在 category 列表頁時，GPT 廣告的 PageKey 設定為 'section.slug'
   * 若 category 無所屬的 section (related-Section)，函式 `getSectionGPTPageKey` 會回傳 'other'
   */

  const gptAdPageKey = getSectionGPTPageKey(section?.slug ?? '')

  const leadArticles = renderList.slice(0, 3)
  const articlesAfterLead = renderList.slice(3)

  const renderListWithAd = articlesAfterLead.slice(0, 6)
  const renderListWithoutAd = articlesAfterLead.slice(6)

  return (
    <>
      <div className="mb-mm-2xl space-y-mm-2xl sm:flex sm:gap-7 sm:space-y-0 sm:bg-mm-neutral-100 sm:px-[16.5px] sm:py-[27.5px]">
        {leadArticles.map((item, index) => {
          const mobileSlotIndex = index === 1 ? 0 : null

          return (
            <Fragment key={item.id}>
              <LeadArticle
                className="sm:min-w-0 sm:flex-1"
                from={from}
                item={item}
                priority={index === 0}
              />
              {mobileSlotIndex !== null && (
                <CompassFitAd
                  className="sm:hidden"
                  enabled={
                    shouldShowAd &&
                    isListingViewportResolved &&
                    isSmUp === false
                  }
                  unitId={COMPASS_FIT_UNITS.listing[mobileSlotIndex]}
                />
              )}
            </Fragment>
          )
        })}
      </div>

      <div className="max-w-180">
        <div className="space-y-mm-2xl">
          {renderListWithAd.map((item, index) => {
            const mobileSlotIndex = index === 0 ? 1 : index === 2 ? 2 : null
            const nonMobileSlotIndex = getCompassFitSlotIndex(index)

            return (
              <Fragment key={item.id}>
                <ArticleListItem from={from} item={item} />
                {mobileSlotIndex !== null && (
                  <CompassFitAd
                    className="sm:hidden"
                    enabled={
                      shouldShowAd &&
                      isListingViewportResolved &&
                      isSmUp === false
                    }
                    unitId={COMPASS_FIT_UNITS.listing[mobileSlotIndex]}
                  />
                )}
                {nonMobileSlotIndex !== null && (
                  <CompassFitAd
                    className="hidden sm:block"
                    enabled={
                      shouldShowAd &&
                      isListingViewportResolved &&
                      isSmUp === true
                    }
                    unitId={COMPASS_FIT_UNITS.listing[nonMobileSlotIndex]}
                  />
                )}
              </Fragment>
            )
          })}
        </div>

        {shouldShowAd && (
          <GPTAd
            adKey="MB_FT"
            className="mx-auto my-mm-2xl h-auto w-full xl:my-[35px]"
            pageKey={gptAdPageKey}
          />
        )}

        <div className="mt-mm-2xl space-y-mm-2xl">
          {renderListWithoutAd.map((item) => (
            <ArticleListItem key={item.id} from={from} item={item} />
          ))}
        </div>
      </div>
    </>
  )
}
