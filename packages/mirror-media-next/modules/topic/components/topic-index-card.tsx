import NextLink from 'next/link'
import Image from '@readr-media/react-image'

import { Typography } from '@/components/ui/typography'
import { getTopicIndexCardImages } from '@/modules/topic/topic-data'
import type { TopicIndexItem } from '@/modules/topic/topic-types'
import { transformTimeData } from '@/utils'

type TopicIndexCardProps = {
  item: TopicIndexItem
}

function TopicIndexCard({ item }: TopicIndexCardProps) {
  const images = getTopicIndexCardImages(item)
  const brief = item.brief?.blocks?.[0]?.text
  const createdAt = item.createdAt
    ? transformTimeData(item.createdAt, 'dot')
    : undefined

  return (
    <NextLink
      className="flex flex-col gap-mm-m"
      href={`/topic/${item.slug}?from=topic_list`}
      rel="noreferrer"
      target="_blank"
    >
      <div className="relative h-[186px] w-full overflow-hidden rounded-mm-m [&_img]:rounded-mm-m">
        <Image
          alt={item.name}
          defaultImage="/images-next/default-og-img.png"
          images={images}
          loadingImage="/images-next/loading.gif"
          objectFit="cover"
          rwd={{ tablet: '320px', desktop: '500px' }}
        />
      </div>
      <div className="flex flex-col gap-mm-m">
        <Typography
          as="p"
          className="line-clamp-2 text-mm-neutral-800"
          variant="subtitle"
        >
          {item.name}
        </Typography>
        {brief ? (
          <Typography
            as="p"
            className="line-clamp-3 text-mm-neutral-500"
            variant="body-s"
          >
            {brief}
          </Typography>
        ) : null}
        {createdAt ? (
          <Typography
            as="time"
            className="text-mm-neutral-400"
            dateTime={item.createdAt ?? undefined}
            variant="caption-l"
          >
            {createdAt}
          </Typography>
        ) : null}
      </div>
    </NextLink>
  )
}

export { TopicIndexCard }
export type { TopicIndexCardProps }
