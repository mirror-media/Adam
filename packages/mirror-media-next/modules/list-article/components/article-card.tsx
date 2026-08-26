import Image from '@readr-media/react-image'

import type { ListingPost } from '@/apollo/fragments/post'
import { cn } from '@/components/cn'
import { Link } from '@/components/ui/link'
import { Typography } from '@/components/ui/typography'

type ArticleCardProps = {
  className?: string
  item: ListingPost
  priority?: boolean
}

export function ArticleCard({ className, item, priority }: ArticleCardProps) {
  return (
    <Link
      className={cn('hover:no-underline', className)}
      href={
        item.type === 'external'
          ? `/external/${item.slug}`
          : `/story/${item.slug}`
      }
      target="_blank"
      rel="noreferrer"
    >
      <div className="relative aspect-[112/80] w-full">
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

      <Typography
        as="h2"
        variant="h5"
        className="mt-mm-l line-clamp-2 text-[rgba(0,0,0,0.87)]"
      >
        {item.title}
      </Typography>
    </Link>
  )
}
