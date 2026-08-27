'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { cn } from '@/components/cn'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Typography } from '@/components/ui/typography'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import { getMicroAdUnitId, needInsertMicroAdAfter } from '@/utils/ad'

import { fetchMoreHomepageNews } from '../homepage-client-data'
import type { HomepageArticle } from '../homepage-types'

import { ArticleImage } from './article-image'
import { homepageCardHoverClass } from './homepage-card-styles'
import { SectionTitle } from './section-title'

const MicroAd = dynamic(
  () => import('@/components/ads/micro-ad/micro-ad-with-label-homepage'),
  { ssr: false }
)

const LEGACY_HOME_MICRO_AD_PC_MEDIA_QUERY = '(min-width: 768px)'

type MoreNewsProps = {
  excludedKeys: string[]
  initialArticles: HomepageArticle[]
  initialHasMore: boolean
}

function formatPublishedDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const parts = new Intl.DateTimeFormat('zh-TW', {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Taipei',
    year: 'numeric',
  }).formatToParts(date)
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  )

  return `${values.year}.${values.month}.${values.day} ${values.hour}:${values.minute}`
}

function MoreNews({
  excludedKeys,
  initialArticles,
  initialHasMore,
}: MoreNewsProps) {
  const [articles, setArticles] = useState(initialArticles)
  const [device, setDevice] = useState<'MB' | 'PC'>('MB')
  const [errorMessage, setErrorMessage] = useState('')
  const [focusArticleKey, setFocusArticleKey] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [statusAnnouncement, setStatusAnnouncement] = useState('')
  const endStatusRef = useRef<HTMLSpanElement | null>(null)
  const firstAppendedArticleRef = useRef<HTMLAnchorElement | null>(null)
  const loadMoreButtonRef = useRef<HTMLButtonElement | null>(null)
  const nextFileNumberRef = useRef(1)
  const requestInFlightRef = useRef(false)
  const shouldFocusEndStatusRef = useRef(false)
  const shouldRestoreFocusRef = useRef(false)
  const { shouldShowAd } = useDisplayAd()

  useEffect(() => {
    const mediaQuery = window.matchMedia(LEGACY_HOME_MICRO_AD_PC_MEDIA_QUERY)
    const updateDevice = () => setDevice(mediaQuery.matches ? 'PC' : 'MB')
    updateDevice()
    mediaQuery.addEventListener('change', updateDevice)
    return () => mediaQuery.removeEventListener('change', updateDevice)
  }, [])

  useEffect(() => {
    if (isLoading) return

    if (shouldRestoreFocusRef.current) {
      shouldRestoreFocusRef.current = false
      loadMoreButtonRef.current?.focus()
      return
    }

    if (focusArticleKey) {
      firstAppendedArticleRef.current?.focus()
      return
    }

    if (shouldFocusEndStatusRef.current) {
      shouldFocusEndStatusRef.current = false
      endStatusRef.current?.focus()
    }
  }, [focusArticleKey, isLoading])

  async function handleLoadMore() {
    if (requestInFlightRef.current || !hasMore) return

    requestInFlightRef.current = true
    shouldFocusEndStatusRef.current = false
    shouldRestoreFocusRef.current = false
    setIsLoading(true)
    setErrorMessage('')
    setStatusAnnouncement('')

    try {
      const existingKeys = [
        ...excludedKeys,
        ...articles.map((article) => article.key),
      ]
      const result = await fetchMoreHomepageNews(
        existingKeys,
        nextFileNumberRef.current
      )

      nextFileNumberRef.current = result.nextFileNumber
      setArticles((current) => current.concat(result.articles))
      setHasMore(result.hasMore)
      setFocusArticleKey(result.articles[0]?.key ?? null)
      shouldFocusEndStatusRef.current =
        !result.articles.length && !result.hasMore
      setStatusAnnouncement(
        result.articles.length
          ? `已載入 ${result.articles.length} 則新聞。`
          : '目前沒有更多新聞。'
      )
    } catch (error) {
      console.error(error)
      shouldFocusEndStatusRef.current = false
      shouldRestoreFocusRef.current = true
      setErrorMessage('載入更多新聞失敗，請稍後重試。')
    } finally {
      requestInFlightRef.current = false
      setIsLoading(false)
    }
  }

  if (!articles.length) {
    return (
      <section aria-labelledby="more-news-title">
        <SectionTitle id="more-news-title">更多新聞</SectionTitle>
        <Typography className="mt-mm-3xl text-center text-mm-neutral-600">
          目前沒有更多新聞。
        </Typography>
      </section>
    )
  }

  return (
    <section aria-labelledby="more-news-title">
      <SectionTitle id="more-news-title">更多新聞</SectionTitle>

      <div className="mt-mm-3xl grid grid-cols-1 gap-y-mm-3xl md:grid-cols-2 md:gap-x-mm-5xl md:gap-y-mm-2xl xl:grid-cols-3 xl:gap-x-mm-l">
        {articles.map((article, index) => {
          const microAdUnitId = getMicroAdUnitId(index, 'HOME', device)

          return (
            <Fragment key={article.key}>
              <article className="h-full min-w-0">
                <Link
                  className={cn(
                    'GTM-homepage-latest-list group flex h-full flex-col',
                    homepageCardHoverClass
                  )}
                  href={article.href}
                  ref={
                    article.key === focusArticleKey
                      ? firstAppendedArticleRef
                      : undefined
                  }
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="relative block aspect-3/2 w-full overflow-hidden bg-mm-neutral-100">
                    <ArticleImage
                      alt={article.title}
                      sizes="(min-width: 1280px) 235px, (min-width: 768px) 332px, calc(100vw - 32px)"
                      src={article.imageUrl}
                    />
                    {article.sectionName && (
                      <span className="absolute top-0 left-0 rounded-br-mm-xs bg-mm-base-600 px-mm-l py-[3px] font-mm-sans text-mm-subtitle text-mm-second-100">
                        {article.sectionName}
                      </span>
                    )}
                  </span>
                  <Typography
                    as="h3"
                    className="mt-mm-m line-clamp-2 min-h-[2.6em] text-mm-neutral-800 group-hover:underline md:mt-mm-l"
                    variant="subtitle"
                  >
                    {article.title}
                  </Typography>
                  {article.publishedDate && (
                    <Typography
                      as="time"
                      className="mt-mm-m block text-mm-neutral-400 md:mt-mm-l"
                      dateTime={article.publishedDate}
                      variant="caption-l"
                    >
                      {formatPublishedDate(article.publishedDate)}
                    </Typography>
                  )}
                </Link>
              </article>

              {shouldShowAd &&
                needInsertMicroAdAfter(index) &&
                microAdUnitId && (
                  <div
                    className="min-w-0 overflow-hidden"
                    data-homepage-micro-ad
                  >
                    <MicroAd microAdType="HOME" unitId={microAdUnitId} />
                  </div>
                )}
            </Fragment>
          )
        })}
      </div>

      {hasMore && (
        <Button
          className="mt-mm-3xl w-full rounded-mm-m py-0 text-mm-h5"
          isLoading={isLoading}
          onClick={handleLoadMore}
          ref={loadMoreButtonRef}
          size="sm"
          type="button"
          variant="outline"
        >
          {isLoading && <Spinner aria-hidden="true" />}
          看更多
        </Button>
      )}

      <span
        aria-live="polite"
        className="block h-0 overflow-hidden outline-none"
        ref={endStatusRef}
        role="status"
        tabIndex={-1}
      >
        {statusAnnouncement}
      </span>

      {errorMessage && (
        <Typography
          className="mt-mm-m text-center text-mm-neutral-600"
          role="alert"
          variant="body-s"
        >
          {errorMessage}
        </Typography>
      )}
    </section>
  )
}

export { MoreNews }
