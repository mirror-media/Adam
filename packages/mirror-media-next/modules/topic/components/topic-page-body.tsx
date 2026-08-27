import type {
  TopicPageLayoutKind,
  TopicPageTopic,
  TopicSlideshowImage,
} from '@/modules/topic/topic-types'
import { TOPIC_RENDER_PAGE_SIZE } from '@/modules/topic/topic-types'

import { TopicCmsStyle } from './topic-cms-style'
import { TopicGroupBody } from './topic-group-body'
import { TopicHero } from './topic-hero'
import { TopicListBody } from './topic-list-body'

type TopicPageBodyProps = {
  layoutKind: TopicPageLayoutKind
  slideshowImages: TopicSlideshowImage[]
  topic: TopicPageTopic
}

function TopicPageBody({
  layoutKind,
  slideshowImages,
  topic,
}: TopicPageBodyProps) {
  const isGroup = layoutKind === 'group'

  return (
    <main className="topicContainer">
      <TopicCmsStyle customCss={topic.style} />
      <TopicHero slideshowImages={slideshowImages} topic={topic} />
      {isGroup ? (
        <TopicGroupBody topic={topic} />
      ) : (
        <TopicListBody
          dfp={topic.dfp}
          featuredPostsCount={topic.featuredPostsCount ?? 0}
          initialPosts={topic.posts}
          renderPageSize={TOPIC_RENDER_PAGE_SIZE}
          topicSlug={topic.slug}
          totalPostsCount={topic.postsCount}
        />
      )}
    </main>
  )
}

export { TopicPageBody }
export type { TopicPageBodyProps }
