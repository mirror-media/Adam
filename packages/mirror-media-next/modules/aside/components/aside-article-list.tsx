import { Fragment } from 'react'
import dynamic from 'next/dynamic'

import { Typography } from '@/components/ui/typography'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import { getPopInId, needInsertPopInAdAfter } from '@/utils/ad'

import type { AsideArticle } from '../aside-types'

import { AsideArticleItem } from './aside-article-item'

const PopInAd = dynamic(() => import('@/components/ads/pop-in/pop-in-ad'), {
  ssr: false,
})

type AsideArticleListProps = {
  articles: AsideArticle[]
  from?: string
  renderAmount?: number
  title: string
  withPopInAd?: boolean
}

export function AsideArticleList({
  articles,
  from,
  renderAmount = 6,
  title,
  withPopInAd = false,
}: AsideArticleListProps) {
  const { shouldShowAd } = useDisplayAd()

  return (
    <section className="w-full">
      <Typography
        as="p"
        variant="h6"
        className="flex h-7 items-center justify-center rounded-t-mm-m bg-mm-base-700 text-mm-second-200"
      >
        {title}
      </Typography>

      <div className="space-y-mm-2xl bg-mm-neutral-100 px-[21px] pt-mm-5xl pb-mm-2xl">
        {articles.slice(0, renderAmount).map((article, index) => {
          const popInId =
            withPopInAd && shouldShowAd && needInsertPopInAdAfter(index)
              ? getPopInId(index)
              : null

          return (
            <Fragment key={article.id}>
              <AsideArticleItem article={article} from={from} />
              {popInId && (
                <PopInAd popInId={popInId} className="mm-pop-in-ad-hot" />
              )}
            </Fragment>
          )
        })}
      </div>
    </section>
  )
}
