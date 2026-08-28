import NextLink from 'next/link'

import { Typography } from '@/components/ui/typography'
import { getTopicHeroBackgroundUrl } from '@/modules/topic/topic-data'
import type {
  TopicPageTopic,
  TopicSlideshowImage,
} from '@/modules/topic/topic-types'

import { TopicSlideshow } from './topic-slideshow'

type TopicHeroProps = {
  slideshowImages: TopicSlideshowImage[]
  topic: TopicPageTopic
}

function TopicHero({ slideshowImages, topic }: TopicHeroProps) {
  const backgroundUrl = getTopicHeroBackgroundUrl(topic)
  return (
    <div
      className="topic relative mb-mm-4xl block h-auto w-full bg-cover bg-center bg-no-repeat pt-[56.25%] md:pt-[36.56%] xl:pt-[25%]"
      style={
        backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined
      }
    >
      {topic.heroUrl ? (
        <NextLink
          aria-label={topic.name}
          className="absolute inset-0"
          href={topic.heroUrl}
          rel="noreferrer"
          target="_blank"
        />
      ) : null}
      <Typography as="h1" className="topic-title" variant="h3">
        {topic.name}
      </Typography>
      <div className="relative z-1">
        <TopicSlideshow images={slideshowImages} />
      </div>
    </div>
  )
}

export { TopicHero }
export type { TopicHeroProps }
