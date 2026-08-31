import dynamic from 'next/dynamic'

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
            className={`groupListBlockContainer tag-${tag.slug} flex flex-col items-center`}
            key={tag.id}
          >
            {index > 0 ? (
              <div className="mx-auto w-full max-w-82.5 md:max-w-7xl md:max-xl:px-23 lg:px-12.5">
                <div className="w-full border-t-2 border-mm-neutral-800" />
              </div>
            ) : null}
            <Typography
              as="h3"
              className="py-mm-3xl text-center text-mm-neutral-800 md:py-mm-5xl"
              variant="h3"
            >
              {tag.name}
            </Typography>
            <TopicCardGrid className="groupArticles w-full max-w-7xl flex-col pb-mm-3xl">
              {taggedPosts.map((item) => (
                <TopicArticleCard item={item} key={item.id} variant="group" />
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
