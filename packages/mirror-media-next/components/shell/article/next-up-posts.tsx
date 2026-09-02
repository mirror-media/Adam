import dynamic from 'next/dynamic'
import Link from 'next/link'

import { cn } from '@/components/cn'
import { ThemeElement } from '@/components/shell/article/theme-element'
import { Typography } from '@/components/ui'
import { DEFAULT_OG_IMAGE_URL } from '@/constants'
import { MICRO_AD_UNITS } from '@/constants/ads'
import useMediaQuery from '@/hooks/use-media-query'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import type { ExternalRelatedStory } from '@/modules/external/external-types'

import NextResponsiveImage from './next-responsive-image'

const StyledMicroAd = dynamic(
  () => import('@/components/ads/micro-ad/micro-ad-with-label'),
  {
    ssr: false,
  }
)

const PopInAdInRelatedList = dynamic(
  () => import('./pop-in-ad-in-related-list'),
  {
    ssr: false,
  }
)

export function NextUpPosts({
  items,
  hiddenAdvertised = false,
}: {
  items: ExternalRelatedStory[]
  hiddenAdvertised?: boolean
}) {
  const isDesktop = useMediaQuery(`(min-width: ${1280})`)
  const device = isDesktop ? 'PC' : 'MB'
  const { shouldShowAd } = useDisplayAd(hiddenAdvertised)

  if (items.length === 0) return null

  return (
    <ThemeElement as="section">
      <ThemeElement
        as="span"
        theme="accent"
        className="inline-flex rounded-t-lg bg-mm-second-700 px-3 py-1"
      >
        <Typography
          as="span"
          variant="subtitle"
          className="text-mm-neutral-100"
        >
          延伸閱讀
        </Typography>
      </ThemeElement>
      <ThemeElement
        as="ul"
        theme="post"
        className="rounded-lg rounded-tl-none p-2.5 md:grid md:grid-cols-2 md:gap-x-6 xl:px-6"
      >
        {items.map((postItem) => (
          <li key={postItem.id} className="border-b border-b-black py-4">
            <Link
              href={`/story/${postItem.slug}?from=referral_bottom`}
              target="_blank"
              className={cn(
                'grid grid-cols-[90px_1fr] items-center gap-x-4 md:grid-cols-[96px_1fr]',
                'article-title GTM-story-related-list',
                postItem.isMesoRecommend
                  ? 'GTM-story-related-miso'
                  : 'GTM-story-related-editor'
              )}
            >
              <picture className="relative block aspect-4/3">
                <NextResponsiveImage
                  fill
                  className="aspect-4/3 object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/images-next/loading.gif"
                  src={
                    typeof postItem.heroImage?.resized?.original === 'string'
                      ? postItem.heroImage?.resized?.original?.replace(
                          /\.(jpg|png)$/i,
                          '.webP'
                        )
                      : DEFAULT_OG_IMAGE_URL
                  }
                  sizes="(max-width: 768px) 50vw, 30vw"
                  srcSet={[480, 800]}
                  alt={postItem.title ?? ''}
                  priority={false}
                  fallback={
                    typeof postItem.heroImage?.resized?.original === 'string'
                      ? postItem.heroImage?.resized?.original
                      : DEFAULT_OG_IMAGE_URL
                  }
                  errorImage={DEFAULT_OG_IMAGE_URL}
                />
              </picture>
              <Typography
                as="div"
                variant="h6"
                className="line-clamp-3 text-mm-base-700"
              >
                {postItem.title}
              </Typography>
            </Link>
          </li>
        ))}
        {shouldShowAd && (
          <>
            {MICRO_AD_UNITS.STORY[device].map((unit) => (
              <StyledMicroAd
                key={unit.name}
                unitId={unit.id}
                microAdType="STORY"
              />
            ))}
            <PopInAdInRelatedList />
          </>
        )}
      </ThemeElement>
    </ThemeElement>
  )
}
