import { Fragment } from 'react'
import dynamic from 'next/dynamic'

import { useBreakpoint } from '@/hooks/use-breakpoint'
import useWindowDimensions from '@/hooks/use-window-dimensions'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import {
  getMicroAdUnitId,
  getSectionGPTPageKey,
  needInsertMicroAdAfter,
} from '@/utils/ad'

import type {
  ArticleListItemData,
  ArticleListSection,
} from '../list-article-types'

import { ArticleListItem } from './article-list-item'
import { LeadArticle } from './lead-article'

const GPTAd = dynamic(() => import('@/components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const MicroAd = dynamic(
  () => import('./micro-ad').then((module) => module.MicroAd),
  { ssr: false }
)

type ArticleListProps = {
  from?: string
  renderList: ArticleListItemData[]
  section?: ArticleListSection
}

export function ArticleList({ from, renderList, section }: ArticleListProps) {
  const { shouldShowAd } = useDisplayAd()
  const { width } = useWindowDimensions()
  const smBreakpoint = useBreakpoint('sm')

  /**
   * 這個元件會被共用於 author/tag/category 列表頁
   * 在 author/tag 列表頁時，由於沒有 section?.slug，函式 `getSectionGPTPageKey` 會回傳 'other'
   * 在 category 列表頁時，GPT 廣告的 PageKey 設定為 'section.slug'
   * 若 category 無所屬的 section (related-Section)，函式 `getSectionGPTPageKey` 會回傳 'other'
   */

  const gptAdPageKey = getSectionGPTPageKey(section?.slug ?? '')

  const leadArticles = renderList.slice(0, 3)
  const articlesAfterLead = renderList.slice(3)

  /**
   * 領頭的那幾篇在 Tailwind `sm` 以下會渲染成一般的列表列，此時整頁是一串連續的
   * 列表，特企的位置要從第一篇開始算，所以它們也要參與計算、列表區的 index 要補上
   * 被切走的三篇。`width` 和 `smBreakpoint` 在首次 client render 前都是 undefined，
   * 但廣告要等 `shouldShowAd`（登入流程跑完）才會出現，不會早於它們。
   */
  const isMobile =
    width !== undefined && smBreakpoint !== undefined && width < smBreakpoint

  const renderListWithAd = shouldShowAd
    ? articlesAfterLead.slice(0, 6)
    : articlesAfterLead.slice(0, 9)

  const renderListWithoutAd = shouldShowAd
    ? articlesAfterLead.slice(6)
    : articlesAfterLead.slice(9)

  return (
    <>
      <div className="mb-mm-2xl space-y-mm-2xl sm:flex sm:gap-7 sm:space-y-0 sm:bg-mm-neutral-100 sm:px-[16.5px] sm:py-[27.5px]">
        {leadArticles.map((item, index) => {
          const microAdUnitId =
            shouldShowAd && isMobile && needInsertMicroAdAfter(index)
              ? getMicroAdUnitId(index, 'LISTING', 'RWD')
              : null

          return (
            <Fragment key={item.id}>
              <LeadArticle
                className="sm:min-w-0 sm:flex-1"
                from={from}
                item={item}
                priority={index === 0}
              />
              {microAdUnitId && <MicroAd unitId={microAdUnitId} />}
            </Fragment>
          )
        })}
      </div>

      <div className="max-w-180">
        <div className="space-y-mm-2xl">
          {renderListWithAd.map((item, index) => {
            const adIndex = isMobile ? index + leadArticles.length : index
            // `getMicroAdUnitId` returns null when the slot has no unit, which
            // the ad component cannot render.
            const microAdUnitId =
              shouldShowAd && needInsertMicroAdAfter(adIndex)
                ? getMicroAdUnitId(adIndex, 'LISTING', 'RWD')
                : null

            return (
              <Fragment key={item.id}>
                <ArticleListItem from={from} item={item} />
                {microAdUnitId && <MicroAd unitId={microAdUnitId} />}
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
