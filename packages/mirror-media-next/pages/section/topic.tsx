import type { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'

import FullScreenAds from '@/components/ads/full-screen-ads'
import GPTMbStAd from '@/components/ads/gpt/gpt-mb-st-ad'
import { GPT_Placeholder } from '@/components/ads/gpt/gpt-placeholder'
import { PageShell } from '@/components/shell/page-shell'
import { Typography } from '@/components/ui/typography'
import { ENV } from '@/config/index.mjs'
import { useDisplayAd } from '@/hooks/useDisplayAd'
import { TopicIndexList } from '@/modules/topic/components/topic-index-list'
import { loadPublishedTopicList } from '@/modules/topic/topic-data'
import type { TopicIndexItem } from '@/modules/topic/topic-types'
import {
  TOPIC_INDEX_FETCH_PAGE_SIZE,
  TOPIC_INDEX_RENDER_PAGE_SIZE,
} from '@/modules/topic/topic-types'
import { getLogTraceObject } from '@/utils'
import type { ShellHeaderData } from '@/utils/api'
import { fetchShellHeaderData } from '@/utils/api'
import { setPageCache } from '@/utils/cache-setting'
import { processSettledResult } from '@/utils/response-processor'

const GPTAd = dynamic(() => import('@/components/ads/gpt/gpt-ad'), {
  ssr: false,
})

type SectionTopicPageProps = {
  headerData: ShellHeaderData
  topics: TopicIndexItem[]
  topicsCount: number
}

function SectionTopicPage({
  headerData,
  topics,
  topicsCount,
}: SectionTopicPageProps) {
  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()

  return (
    <>
      <PageShell head={{ title: '精選專區' }} headerData={headerData}>
        <main className="mx-auto w-full max-w-7xl pb-mm-5xl xl:px-0">
          <GPT_Placeholder
            isLogInProcessFinished={isLogInProcessFinished}
            shouldShowAd={shouldShowAd}
          >
            {shouldShowAd ? (
              <div className="mx-auto w-full max-w-242.5">
                <GPTAd adKey="HD" pageKey="other" />
              </div>
            ) : (
              <></>
            )}
          </GPT_Placeholder>
          <Typography
            as="h1"
            className="mx-auto mt-mm-3xl mb-mm-2xl w-full max-w-82.5 text-mm-base-300 md:max-w-none md:max-xl:px-23 lg:px-12.5"
            variant="h3"
          >
            精選專區
          </Typography>
          <TopicIndexList
            renderPageSize={TOPIC_INDEX_RENDER_PAGE_SIZE}
            topics={topics}
            topicsCount={topicsCount}
          />
          {shouldShowAd ? (
            <div className="fixed right-0 bottom-0 left-0 z-(--mm-z-shell-overlay) mx-auto w-full xl:hidden">
              <GPTMbStAd pageKey="other" />
            </div>
          ) : null}
          {shouldShowAd ? <FullScreenAds /> : null}
        </main>
      </PageShell>
    </>
  )
}

export default SectionTopicPage

export const getServerSideProps = (async ({ req, res }) => {
  if (ENV === 'prod') {
    setPageCache(
      res,
      {
        cachePolicy: 'max-age',
        cacheTime: 600,
        sharedCacheTime: 600,
        staleWhileRevalidate: 3600,
      },
      req.url
    )
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  const globalLogFields: Record<string, unknown> = {
    ...getLogTraceObject(req),
  }
  const [headerData, topicListResponse] = await Promise.all([
    fetchShellHeaderData({ logFields: globalLogFields }),
    Promise.allSettled([
      loadPublishedTopicList(TOPIC_INDEX_FETCH_PAGE_SIZE, 0),
    ]),
  ])

  const topicList = processSettledResult<
    Awaited<ReturnType<typeof loadPublishedTopicList>>,
    Awaited<ReturnType<typeof loadPublishedTopicList>>
  >(
    topicListResponse[0],
    (value) => value ?? { topics: [], topicsCount: 0 },
    'Error occurs while getting posts in section/topic page',
    globalLogFields
  )

  if (topicList.topics.length === 0) {
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: 'fetch topics return empty posts, redirect to 404',
        globalLogFields,
      })
    )
    return { notFound: true }
  }

  return {
    props: {
      headerData,
      topics: topicList.topics,
      topicsCount: topicList.topicsCount,
    },
  }
}) satisfies GetServerSideProps<SectionTopicPageProps>
