import { Fragment } from 'react'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'

import { cn } from '@/components/cn'
import { Typography } from '@/components/ui/typography'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import { getPopInId, needInsertPopInAdAfter } from '@/utils/ad'

import type { HomepageArticle } from '../homepage-types'

import { ArticleImage } from './article-image'
import { homepageCardLinkFocusClass } from './homepage-card-styles'
import { SectionTitle } from './section-title'

const PopInAd = dynamic(() => import('@/components/ads/pop-in/pop-in-ad'), {
  ssr: false,
})

type HeadlineListProps = {
  articles: HomepageArticle[]
  className?: string
  title: string
  titleId: string
  trackingClassName?: string
  trackingFrom?: string
  withPopInAds?: boolean
}

function HeadlineList({
  articles,
  className,
  title,
  titleId,
  trackingClassName,
  trackingFrom,
  withPopInAds = false,
}: HeadlineListProps) {
  const { isLogInProcessFinished, shouldShowAd } = useDisplayAd()
  // An ad-free member is the one case where the slot is known to stay empty for
  // good, so it is dropped once the member check answers. Everyone else keeps
  // the reserved row: it covers the load window, and a no-fill is silent.
  const keepsAdSlot = !isLogInProcessFinished || shouldShowAd

  if (!articles.length) return null

  return (
    <section aria-labelledby={titleId} className={className}>
      <SectionTitle id={titleId}>{title}</SectionTitle>
      <ol className="mt-mm-xl xl:mt-mm-l">
        {articles.slice(0, 8).map((article, index) => {
          // The slot is decided on the server so the row holds its height from
          // the first paint; only the ad inside it waits for the member check.
          const popInId =
            withPopInAds && keepsAdSlot && needInsertPopInAdAfter(index)
              ? getPopInId(index)
              : null

          return (
            <Fragment key={article.key}>
              <li className="border-t border-mm-neutral-300 py-mm-m">
                <NextLink
                  className={cn(
                    'group grid min-h-16 grid-cols-[96px_minmax(0,1fr)] items-center gap-mm-m xl:gap-mm-l',
                    homepageCardLinkFocusClass,
                    trackingClassName
                  )}
                  href={`${article.href}${
                    trackingFrom ? `?from=${trackingFrom}` : ''
                  }`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="relative block h-16 w-24 overflow-hidden bg-mm-neutral-100">
                    <ArticleImage alt="" sizes="96px" src={article.imageUrl} />
                  </span>
                  <Typography
                    as="h3"
                    className="line-clamp-2 text-mm-neutral-700 group-hover:underline"
                    variant="body-l"
                  >
                    {article.title}
                  </Typography>
                </NextLink>
              </li>
              {popInId && (
                <li
                  className="min-w-0 overflow-hidden border-t border-mm-neutral-300 py-mm-m"
                  data-homepage-pop-in-ad
                >
                  <div className="mm-pop-in-ad-homepage-hot">
                    {shouldShowAd && <PopInAd popInId={popInId} />}
                  </div>
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </section>
  )
}

export { HeadlineList }
