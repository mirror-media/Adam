import dynamic from 'next/dynamic'

import { cn } from '@/components/cn'
import { Typography } from '@/components/ui/typography'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import { getTopicGroupSections } from '@/modules/topic/topic-data'
import type { TopicPageTopic } from '@/modules/topic/topic-types'

import { TopicArticleCard } from './topic-article-card'
import { TopicCardGrid } from './topic-card-grid'

const GPTAd = dynamic(() => import('@/components/ads/gpt/gpt-ad'), {
  ssr: false,
})

type TopicGroupBodyProps = {
  topic: TopicPageTopic
}

function TopicGroupBody({ topic }: TopicGroupBodyProps) {
  const { shouldShowAd } = useDisplayAd()
  const { dfp } = topic
  const tagSections = getTopicGroupSections(topic)

  return (
    <div className="groupList w-full">
      <div className="flex w-full flex-col">
        {tagSections.map(({ tag, taggedPosts }, index) => (
          <section
            className={cn(
              `groupListBlockContainer tag-${tag.slug} flex flex-col items-center`,
              index > 0 && 'border-t-2 border-mm-neutral-800'
            )}
            key={tag.id}
          >
            <Typography
              as="h2"
              className="py-mm-3xl text-center text-mm-neutral-800 md:py-mm-5xl"
              variant="h3"
            >
              {tag.name}
            </Typography>
            <TopicCardGrid className="groupArticles w-full max-w-7xl flex-col pb-mm-3xl">
              {taggedPosts.map((item) => (
                <TopicArticleCard item={item} key={item.id} />
              ))}
            </TopicCardGrid>
          </section>
        ))}
      </div>
      {shouldShowAd && dfp ? (
        <div className="mx-auto my-mm-3xl w-full max-w-242.5">
          <GPTAd adUnit={dfp} />
        </div>
      ) : null}
    </div>
  )
}

export { TopicGroupBody }
export type { TopicGroupBodyProps }
