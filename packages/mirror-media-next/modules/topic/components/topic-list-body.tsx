import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useLazyQuery } from '@apollo/client'

import { fetchTopic } from '@/apollo/query/topics'
import InfiniteScrollList from '@/components/infinite-scroll-list'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import {
  fetchTopicByTopicSlug,
  hasMoreFeaturedPosts,
  toTopicArticle,
} from '@/modules/topic/topic-data'
import type { TopicArticle } from '@/modules/topic/topic-types'

import { TopicArticleCard } from './topic-article-card'
import { TopicCardGrid } from './topic-card-grid'

const GPTAd = dynamic(() => import('@/components/ads/gpt/gpt-ad'), {
  ssr: false,
})

type TopicArticleGridProps = {
  articles: TopicArticle[]
}

function TopicArticleGrid({ articles }: TopicArticleGridProps) {
  return (
    <TopicCardGrid className="w-full">
      {articles.map((item) => (
        <TopicArticleCard item={item} key={item.id} />
      ))}
    </TopicCardGrid>
  )
}

type TopicFeaturedListProps = {
  featuredPostsCount: number
  initialPosts: TopicArticle[]
  renderPageSize: number
  topicSlug: string
}

function TopicFeaturedList({
  featuredPostsCount,
  initialPosts,
  renderPageSize,
  topicSlug,
}: TopicFeaturedListProps) {
  const [renderPosts, setRenderPosts] = useState(initialPosts)
  const showMore = hasMoreFeaturedPosts(featuredPostsCount, renderPosts.length)
  const [getFeaturedPostsInTopic, { loading, error }] = useLazyQuery(
    fetchTopic,
    {
      variables: {
        topicFilter: { slug: { equals: topicSlug } },
        postsFilter: {
          state: { equals: 'published' },
          isFeatured: { equals: true },
        },
        postsOrderBy: [{ isFeatured: 'desc' }, { publishedDate: 'desc' }],
        postsTake: renderPageSize,
        postsSkip: renderPosts.length,
      },
    }
  )

  async function handleLoadMore() {
    const response = await getFeaturedPostsInTopic()

    if (response.error || error) {
      console.error(response.error)
      return
    }

    const newPosts = (response.data?.topics?.[0]?.posts ?? []).flatMap(
      (post: unknown) => {
        const article = toTopicArticle(post)
        return article ? [article] : []
      }
    )

    setRenderPosts((current) => [...current, ...newPosts])
  }

  return (
    <div className="flex w-full flex-col items-center gap-mm-5xl">
      <TopicArticleGrid articles={renderPosts} />
      {showMore ? (
        <Button
          className="showMoreButton w-full max-w-85 rounded-mm-m px-2.5 py-2.5 text-mm-h5 hover:bg-mm-neutral-100 hover:text-mm-neutral-600 md:max-w-150 xl:max-w-178.5"
          isLoading={loading}
          onClick={handleLoadMore}
          size="sm"
          type="button"
          variant="outline"
        >
          {loading ? <Spinner className="size-4" /> : '看更多'}
        </Button>
      ) : null}
    </div>
  )
}

type TopicNonFeaturedListProps = {
  featuredPostsCount: number
  hasNonFeaturedPostsInListAboveAd: boolean
  renderPageSize: number
  topicSlug: string
  totalPostsCount: number
}

function TopicNonFeaturedList({
  featuredPostsCount,
  hasNonFeaturedPostsInListAboveAd,
  renderPageSize,
  topicSlug,
  totalPostsCount,
}: TopicNonFeaturedListProps) {
  const postsCount =
    totalPostsCount -
    (featuredPostsCount >= renderPageSize ? featuredPostsCount : renderPageSize)

  async function fetchTopicPostsFromPage(page: number) {
    if (!topicSlug) {
      return
    }

    try {
      const take = renderPageSize
      const minimumSkipAmount = hasNonFeaturedPostsInListAboveAd
        ? take
        : featuredPostsCount
      const skip = (page - 1) * take + minimumSkipAmount
      const response = await fetchTopicByTopicSlug(topicSlug, take, skip)
      return (response.data?.topics?.[0]?.posts ?? []).flatMap(
        (post: unknown) => {
          const article = toTopicArticle(post)
          return article ? [article] : []
        }
      )
    } catch (error) {
      console.error(error)
    }
    return
  }

  return (
    <div className="w-full">
      <InfiniteScrollList
        fetchCount={Math.ceil(postsCount / renderPageSize)}
        fetchListInPage={fetchTopicPostsFromPage}
        loader={
          <div className="flex justify-center py-mm-3xl xl:py-mm-6xl" key={0}>
            <Spinner className="size-8 text-mm-base-500" />
          </div>
        }
        renderAmount={renderPageSize}
      >
        {(renderList) => (
          <TopicArticleGrid articles={renderList as TopicArticle[]} />
        )}
      </InfiniteScrollList>
    </div>
  )
}

type TopicListBodyProps = {
  dfp?: string | null
  featuredPostsCount: number
  initialPosts: TopicArticle[]
  renderPageSize: number
  topicSlug: string
  totalPostsCount: number
}

function TopicListBody({
  dfp,
  featuredPostsCount,
  initialPosts,
  renderPageSize,
  topicSlug,
  totalPostsCount,
}: TopicListBodyProps) {
  const { shouldShowAd } = useDisplayAd()
  const hasNonFeaturedPostsInListAboveAd = initialPosts.some(
    (post) => !post.isFeatured
  )
  const shouldShowListArticlesBelowAd = hasNonFeaturedPostsInListAboveAd
    ? totalPostsCount > initialPosts.length
    : totalPostsCount > featuredPostsCount

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-mm-5xl pb-mm-5xl xl:px-0">
      <TopicFeaturedList
        featuredPostsCount={featuredPostsCount}
        initialPosts={initialPosts}
        renderPageSize={renderPageSize}
        topicSlug={topicSlug}
      />
      {shouldShowAd && dfp ? (
        <div className="w-full max-w-242.5">
          <GPTAd adUnit={dfp} />
        </div>
      ) : null}
      {shouldShowListArticlesBelowAd ? (
        <TopicNonFeaturedList
          featuredPostsCount={featuredPostsCount}
          hasNonFeaturedPostsInListAboveAd={hasNonFeaturedPostsInListAboveAd}
          renderPageSize={renderPageSize}
          topicSlug={topicSlug}
          totalPostsCount={totalPostsCount}
        />
      ) : null}
    </div>
  )
}

export { TopicListBody }
export type { TopicListBodyProps }
