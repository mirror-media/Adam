import NextLink from 'next/link'
import Image from '@readr-media/react-image'

import { Typography } from '@/components/ui/typography'
import { toTopicImageSet } from '@/modules/topic/topic-data'
import type { TopicArticle } from '@/modules/topic/topic-types'
import { transformTimeData } from '@/utils'

import { TopicSectionBadge } from './topic-card-grid'

type TopicArticleCardProps = {
  item: TopicArticle
}

function TopicArticleCard({ item }: TopicArticleCardProps) {
  const section = item.sections.find(
    (itemSection) => itemSection.slug !== 'member'
  )
  const publishedDate = item.publishedDate
    ? transformTimeData(item.publishedDate, 'dot')
    : undefined

  return (
    <NextLink
      className="itemWrapper flex flex-col gap-mm-m"
      href={`/story/${item.slug}?from=topic_list`}
      rel="noreferrer"
      target="_blank"
    >
      <div className="imageContainer relative h-[186px] w-full overflow-hidden rounded-mm-m [&_img]:rounded-mm-m">
        <Image
          alt={item.title}
          defaultImage="/images-next/default-og-img.png"
          images={toTopicImageSet(item.heroImage?.resized)}
          imagesWebP={toTopicImageSet(item.heroImage?.resizedWebp)}
          loadingImage="/images-next/loading.gif"
          objectFit="cover"
          rwd={{ mobile: '500px', tablet: '500px', desktop: '500px' }}
        />
        {section ? <TopicSectionBadge>{section.name}</TopicSectionBadge> : null}
      </div>
      <div className="itemDetail flex flex-col gap-mm-m">
        <Typography
          as="h2"
          className="itemTitle line-clamp-2 text-mm-neutral-800"
          variant="subtitle"
        >
          {item.title}
        </Typography>
        {publishedDate ? (
          <Typography
            as="time"
            className="itemDate text-mm-neutral-400"
            dateTime={item.publishedDate}
            variant="caption-l"
          >
            {publishedDate}
          </Typography>
        ) : null}
      </div>
    </NextLink>
  )
}

export { TopicArticleCard }
export type { TopicArticleCardProps }
