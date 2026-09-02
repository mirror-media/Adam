import dynamic from 'next/dynamic'

import { GPT_Placeholder_Aside } from '@/components/ads/gpt/gpt-placeholder'
import { useDisplayAd } from '@/hooks/useDisplayAd'

import { usePinnedAside } from '../use-pinned-aside'

import { FbPagePlugin } from './fb-page-plugin'
import { GoogleNewsFollow } from './google-news-follow'
import { LatestArticles } from './latest-articles'
import { PopularArticles } from './popular-articles'

const GPTAd = dynamic(() => import('@/components/ads/gpt/gpt-ad'), {
  ssr: false,
})

type AsideColumnProps = {
  /** GPT 的 pageKey。沒有所屬 section 的頁面用 `'other'`。 */
  pageKey: string
  /** 空字串時，最新文章會 fallback 到新聞列表。 */
  sectionSlug: string
}

/**
 * 列表頁右側的欄位。捲到自己的下緣時會釘在畫面底部，做法見 `usePinnedAside`。
 *
 * `lg` 以下整塊不顯示，所以手機不會打最新文章與熱門文章那兩支 API。外層那個 div 不是
 * 多餘的：它是 flex item、會被拉成整列高度，sticky 的移動行程來自它。
 */
export function AsideColumn({ pageKey, sectionSlug }: AsideColumnProps) {
  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()
  const { asideRef, top } = usePinnedAside()

  return (
    <div className="hidden w-full max-w-106 shrink-0 lg:block">
      <aside
        ref={asideRef}
        className="sticky flex flex-col gap-mm-4xl"
        style={{ top }}
      >
        <LatestArticles sectionSlug={sectionSlug} />
        <GPT_Placeholder_Aside
          shouldShowAd={shouldShowAd}
          isLogInProcessFinished={isLogInProcessFinished}
        >
          {shouldShowAd && (
            <GPTAd
              adKey="PC_R2"
              className="mx-auto h-auto w-full"
              pageKey={pageKey}
            />
          )}
        </GPT_Placeholder_Aside>
        <PopularArticles />
        <GoogleNewsFollow />
        <FbPagePlugin />
      </aside>
    </div>
  )
}
