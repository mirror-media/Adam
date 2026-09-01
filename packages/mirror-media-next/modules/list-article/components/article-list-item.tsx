import Image from '@readr-media/react-image'

import type { ListingPost } from '@/apollo/fragments/post'
import { Link } from '@/components/ui/link'
import { Typography } from '@/components/ui/typography'
import { transformTimeDataIntoDotFormat } from '@/utils'

type ArticleListItemProps = {
  from?: string
  item: ListingPost
  priority?: boolean
}

export function ArticleListItem({
  from,
  item,
  priority,
}: ArticleListItemProps) {
  const sectionName = item.sections?.[0]?.name

  return (
    <Link
      className="relative block hover:no-underline sm:flex sm:items-center sm:gap-mm-xl"
      href={`${
        item.type === 'external'
          ? `/external/${item.slug}`
          : `/story/${item.slug}`
      }${from ? `?from=${from}` : ''}`}
      target="_blank"
      rel="noreferrer"
    >
      <div className="relative mb-mm-l aspect-[330/220] w-full sm:mb-0 sm:aspect-auto sm:h-[127px] sm:w-[179px] sm:shrink-0">
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

      <div>
        <Typography
          as="h2"
          variant="subtitle"
          className="mb-mm-l line-clamp-2 text-mm-neutral-800 sm:mb-1 sm:text-mm-h5"
        >
          {item.title}
        </Typography>
        <Typography
          as="p"
          variant="caption-l"
          className="text-[#a1a1a1] sm:text-mm-caption-s sm:text-mm-neutral-700"
        >
          {transformTimeDataIntoDotFormat(item.publishedDate)}
        </Typography>
        <Typography
          as="p"
          variant="body-s"
          className="hidden text-mm-neutral-500 sm:line-clamp-2"
        >
          {item.brief?.blocks?.[0]?.text}
        </Typography>
      </div>
    </Link>
  )
}
