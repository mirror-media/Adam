import { Fragment, useEffect, useRef, useState } from 'react'
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
  articles?: AsideArticle[]
  /**
   * When given, the list fetches its own articles the first time it enters the
   * viewport, and `articles` is ignored.
   */
  fetchFunc?: () => Promise<AsideArticle[]>
  from?: string
  renderAmount?: number
  title: string
  withPopInAd?: boolean
}

export function AsideArticleList({
  articles = [],
  fetchFunc,
  from,
  renderAmount = 6,
  title,
  withPopInAd = false,
}: AsideArticleListProps) {
  const { shouldShowAd } = useDisplayAd()

  const wrapperRef = useRef<HTMLElement>(null)
  const [fetchedArticles, setFetchedArticles] = useState<AsideArticle[]>([])

  // A new `fetchFunc` is a new list to fetch — moving between category pages
  // changes which section the latest articles come from — so this starts a
  // fresh round rather than remembering that it already fetched once.
  useEffect(() => {
    const wrapper = wrapperRef.current

    if (!fetchFunc || !wrapper) {
      return
    }
    let isStale = false
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }
        observer.unobserve(entry.target)
        fetchFunc().then((articles) => {
          if (!isStale) {
            setFetchedArticles(articles)
          }
        })
      })
    })
    observer.observe(wrapper)

    return () => {
      isStale = true
      observer.disconnect()
    }
  }, [fetchFunc])

  const renderedArticles = fetchFunc ? fetchedArticles : articles

  return (
    <section className="w-full" ref={wrapperRef}>
      <Typography
        as="p"
        variant="h6"
        className="flex h-7 items-center justify-center rounded-t-mm-m bg-mm-base-700 text-mm-second-200"
      >
        {title}
      </Typography>

      {/*
        Reserving the height keeps the page from jumping when a lazily fetched
        list arrives. A row is as tall as its image, which `AsideArticleItem`
        fixes at 114px; the rest is this container's own padding and gaps.
      */}
      <div
        className="space-y-mm-2xl bg-mm-neutral-100 px-[21px] pt-mm-5xl pb-mm-2xl"
        style={{
          minHeight: `calc(var(--spacing-mm-5xl) + var(--spacing-mm-2xl) + ${renderAmount} * 114px + ${renderAmount - 1} * var(--spacing-mm-2xl))`,
        }}
      >
        {renderedArticles.slice(0, renderAmount).map((article, index) => {
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
