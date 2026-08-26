import Image from '@readr-media/react-image'

import type { ListingPost } from '@/apollo/fragments/post'
import { Link } from '@/components/ui/link'
import { Typography } from '@/components/ui/typography'
import { transformTimeDataIntoDotFormat } from '@/utils'

type ArticleListItemProps = {
  item: ListingPost
  priority?: boolean
}

export function ArticleListItem({ item, priority }: ArticleListItemProps) {
  return (
    <Link
      className="flex items-center gap-mm-xl hover:no-underline"
      href={
        item.type === 'external'
          ? `/external/${item.slug}`
          : `/story/${item.slug}`
      }
      target="_blank"
      rel="noreferrer"
    >
      <div className="relative h-[127px] w-[179px] shrink-0">
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

      <div>
        <Typography
          as="h2"
          variant="h5"
          className="mb-1 line-clamp-2 text-mm-neutral-800"
        >
          {item.title}
        </Typography>
        <Typography as="p" variant="caption-s" className="text-mm-neutral-700">
          {transformTimeDataIntoDotFormat(item.publishedDate)}
        </Typography>
        <Typography
          as="p"
          variant="body-s"
          className="line-clamp-2 text-mm-neutral-500"
        >
          {item.brief?.blocks?.[0]?.text}
        </Typography>
      </div>
    </Link>
  )
}
