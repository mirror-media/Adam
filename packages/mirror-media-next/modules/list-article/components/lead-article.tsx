import Image from '@readr-media/react-image'

import type { ListingPost } from '@/apollo/fragments/post'
import { cn } from '@/components/cn'
import { Link } from '@/components/ui/link'
import { Typography } from '@/components/ui/typography'
import { transformTimeDataIntoDotFormat } from '@/utils'

type LeadArticleProps = {
  className?: string
  from?: string
  item: ListingPost
  priority?: boolean
}

/**
 * One of the articles leading the list. It is a card from sm up; below it the
 * design has no card, so it reads as an ordinary list row — which is why the
 * section badge and the date are rendered here and hidden from sm up.
 */
export function LeadArticle({
  className,
  from,
  item,
  priority,
}: LeadArticleProps) {
  const sectionName = item.sections?.[0]?.name

  return (
    <Link
      className={cn('relative block hover:no-underline', className)}
      href={`${
        item.type === 'external'
          ? `/external/${item.slug}`
          : `/story/${item.slug}`
      }${from ? `?from=${from}` : ''}`}
      target="_blank"
      rel="noreferrer"
    >
      <div className="relative aspect-[330/220] w-full sm:aspect-[112/80]">
        <Image
          images={item.heroImage?.resized}
          imagesWebP={item.heroImage?.resizedWebp}
          alt={item.title}
          loadingImage="/images-next/loading.gif"
          defaultImage="/images-next/default-og-img.png"
          rwd={{ mobile: '400px', tablet: '400px', desktop: '400px' }}
          priority={priority}
        />
      </div>

      {sectionName && (
        <Typography
          as="span"
          variant="subtitle"
          className="absolute top-0 left-0 flex h-6 items-center bg-mm-base-600 px-2.5 text-mm-second-100 sm:hidden"
        >
          {sectionName}
        </Typography>
      )}

      <Typography
        as="h2"
        variant="subtitle"
        className="mt-mm-l mb-mm-l line-clamp-2 text-mm-neutral-800 sm:mb-0 sm:text-mm-h5 sm:text-[rgba(0,0,0,0.87)]"
      >
        {item.title}
      </Typography>

      <Typography
        as="p"
        variant="caption-l"
        className="text-[#a1a1a1] sm:hidden"
      >
        {transformTimeDataIntoDotFormat(item.publishedDate)}
      </Typography>
    </Link>
  )
}
