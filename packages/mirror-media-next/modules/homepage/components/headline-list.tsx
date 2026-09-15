import { Fragment } from 'react'
import NextLink from 'next/link'

import { AD_SLOT_LAYOUTS } from '@/components/ads/ad-slot-layouts'
import { PrismAdSlot } from '@/components/ads/prism/prism-ad-slot'
import { PRISM_SIDE_PLACEMENTS } from '@/components/ads/prism/prism-config'
import { cn } from '@/components/cn'
import { Typography } from '@/components/ui/typography'
import { useDisplayAd } from '@/hooks/useDisplayAd'

import type { HomepageArticle } from '../homepage-types'

import { ArticleImage } from './article-image'
import { homepageCardLinkFocusClass } from './homepage-card-styles'
import { SectionTitle } from './section-title'

type HeadlineListProps = {
  articles: HomepageArticle[]
  className?: string
  title: string
  titleId: string
  trackingClassName?: string
  trackingFrom?: string
  withPrismAds?: boolean
}

function HeadlineList({
  articles,
  className,
  title,
  titleId,
  trackingClassName,
  trackingFrom,
  withPrismAds = false,
}: HeadlineListProps) {
  const { shouldShowAd } = useDisplayAd()

  if (!articles.length) return null

  return (
    <section aria-labelledby={titleId} className={className}>
      <SectionTitle id={titleId}>{title}</SectionTitle>
      <ol className="mt-mm-xl xl:mt-mm-l">
        {articles.slice(0, 8).map((article, index) => {
          const prismPlacement =
            index === 1
              ? PRISM_SIDE_PLACEMENTS.homepage[0]
              : index === 2
                ? PRISM_SIDE_PLACEMENTS.homepage[1]
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
              {withPrismAds && prismPlacement && (
                <li className="border-t border-mm-neutral-300 py-mm-m">
                  <PrismAdSlot
                    className={
                      AD_SLOT_LAYOUTS.prism.homepageHeadlineRow.className
                    }
                    enabled={shouldShowAd}
                    placement={prismPlacement}
                  />
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
