import { Fragment } from 'react'
import dynamic from 'next/dynamic'

import type { ListingPost } from '@/apollo/fragments/post'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import {
  getMicroAdUnitId,
  getSectionGPTPageKey,
  needInsertMicroAdAfter,
} from '@/utils/ad'

import type { ArticleListSection } from '../list-article-types'

import { ArticleCard } from './article-card'
import { ArticleListItem } from './article-list-item'

const GPTAd = dynamic(() => import('@/components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const MicroAd = dynamic(
  () => import('./micro-ad').then((module) => module.MicroAd),
  { ssr: false }
)

type ArticleListProps = {
  renderList: ListingPost[]
  section?: ArticleListSection
}

export function ArticleList({ renderList, section }: ArticleListProps) {
  const { shouldShowAd } = useDisplayAd()

  /**
   * 這個元件會被共用於 author/tag/category 列表頁
   * 在 author/tag 列表頁時，由於沒有 section?.slug，函式 `getSectionGPTPageKey` 會回傳 'other'
   * 在 category 列表頁時，GPT 廣告的 PageKey 設定為 'section.slug'
   * 若 category 無所屬的 section (related-Section)，函式 `getSectionGPTPageKey` 會回傳 'other'
   */
  const gptAdPageKey = getSectionGPTPageKey(section?.slug ?? '')

  // The lead articles are taken off the top before the ad slots are worked
  // out, so those keep counting from the first row exactly as before.
  const cardList = renderList.slice(0, 3)
  const listAfterCards = renderList.slice(3)

  const renderListWithAd = shouldShowAd
    ? listAfterCards.slice(0, 9)
    : listAfterCards.slice(0, 12)

  const renderListWithoutAd = shouldShowAd
    ? listAfterCards.slice(9)
    : listAfterCards.slice(12)

  return (
    <>
      {/* 列表元件_List */}
      <div className="mb-mm-2xl flex gap-7 bg-mm-neutral-100 px-[16.5px] py-[27.5px]">
        {cardList.map((item, index) => (
          <ArticleCard
            key={item.id}
            className="min-w-0 flex-1"
            item={item}
            priority={index === 0}
          />
        ))}
      </div>

      <div className="max-w-180">
        <div className="space-y-mm-2xl">
          {renderListWithAd.map((item, index) => {
            // `getMicroAdUnitId` returns null when the slot has no unit, which
            // the ad component cannot render.
            const microAdUnitId =
              shouldShowAd && needInsertMicroAdAfter(index)
                ? getMicroAdUnitId(index, 'LISTING', 'RWD')
                : null

            return (
              <Fragment key={item.id}>
                <ArticleListItem item={item} />
                {microAdUnitId && <MicroAd unitId={microAdUnitId} />}
              </Fragment>
            )
          })}
        </div>

        {shouldShowAd && (
          <GPTAd
            adKey="FT"
            className="mx-auto my-mm-2xl h-auto w-full legacy-xl:my-[35px]"
            pageKey={gptAdPageKey}
          />
        )}

        <div className="space-y-mm-2xl">
          {renderListWithoutAd.map((item) => (
            <ArticleListItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  )
}
