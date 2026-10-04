import { Fragment } from 'react'
import dynamic from 'next/dynamic'

import InfiniteScrollList from '@/components/infinite-scroll-list'
import { Spinner } from '@/components/ui/spinner'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import { fetchTopicList, toTopicIndexItem } from '@/modules/topic/topic-data'
import type { TopicIndexItem } from '@/modules/topic/topic-types'
import { TOPIC_INDEX_FETCH_PAGE_SIZE } from '@/modules/topic/topic-types'
import { getMicroAdUnitId, needInsertMicroAdAfter } from '@/utils/ad'

import { TopicCardGrid } from './topic-card-grid'
import { TopicIndexCard } from './topic-index-card'

const GPTAd = dynamic(() => import('@/components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const StyledMicroAd = dynamic(
  () => import('@/components/ads/micro-ad/micro-ad-with-label'),
  {
    ssr: false,
  }
)

type TopicIndexListProps = {
  renderPageSize: number
  topics: TopicIndexItem[]
  topicsCount: number
}

function TopicIndexCards({ items }: { items: TopicIndexItem[] }) {
  const { shouldShowAd } = useDisplayAd()
  const withAd = shouldShowAd ? items.slice(0, 9) : items.slice(0, 12)
  const afterAd = shouldShowAd ? items.slice(9) : items.slice(12)

  return (
    <>
      <TopicCardGrid>
        {withAd.map((item, index) => {
          const unitId = getMicroAdUnitId(index, 'LISTING', 'RWD')

          return (
            <Fragment key={item.id}>
              <TopicIndexCard item={item} />
              {shouldShowAd && needInsertMicroAdAfter(index) && unitId ? (
                <div className="mx-auto w-full max-w-82.5 min-w-0 overflow-hidden md:mx-0 md:w-70 md:max-w-70 md:shrink-0">
                  <StyledMicroAd microAdType="LISTING" unitId={unitId} />
                </div>
              ) : null}
            </Fragment>
          )
        })}
      </TopicCardGrid>
      {shouldShowAd ? (
        <div className="mx-auto my-mm-3xl w-full max-w-242.5">
          <GPTAd adKey="FT" pageKey="other" />
        </div>
      ) : null}
      {afterAd.length > 0 ? (
        <TopicCardGrid>
          {afterAd.map((item) => (
            <TopicIndexCard item={item} key={item.id} />
          ))}
        </TopicCardGrid>
      ) : null}
    </>
  )
}

function TopicIndexList({
  renderPageSize,
  topics,
  topicsCount,
}: TopicIndexListProps) {
  const fetchPageSize = TOPIC_INDEX_FETCH_PAGE_SIZE

  async function fetchTopicsFromPage(page: number) {
    try {
      const response = await fetchTopicList(
        fetchPageSize,
        (page - 1) * fetchPageSize
      )
      return (response.data?.topics ?? []).flatMap((topic: unknown) => {
        const item = toTopicIndexItem(topic)
        return item ? [item] : []
      })
    } catch (error) {
      console.error(error)
    }
    return
  }

  return (
    <InfiniteScrollList
      fetchCount={Math.ceil(topicsCount / fetchPageSize)}
      fetchListInPage={fetchTopicsFromPage}
      initialList={topics}
      loader={
        <div className="flex justify-center py-mm-3xl xl:py-mm-6xl" key={0}>
          <Spinner className="size-8 text-mm-base-500" />
        </div>
      }
      renderAmount={renderPageSize}
    >
      {(renderList) => (
        <TopicIndexCards items={renderList as TopicIndexItem[]} />
      )}
    </InfiniteScrollList>
  )
}

export { TopicIndexList }
export type { TopicIndexListProps }
