import { useState } from 'react'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'

import AudioPlayer from '@/components/podcast/audio-player'
import Dropdown from '@/components/podcast/author-select-dropdown'
import type { Podcast } from '@/components/podcast/podcast.types'
import { toPodcastListViewModel } from '@/components/podcast/podcast-adapter'
import PodcastList from '@/components/podcast/podcast-list'
import Layout from '@/components/shared/layout'
import { Typography } from '@/components/ui/typography'
import { ENV, URL_STATIC_PODCAST_LIST } from '@/config/index.mjs'
import { getLogTraceObject } from '@/utils'
import type { HeadersData, Topics } from '@/utils/api'
import {
  fetchHeaderDataInDefaultPageLayout,
  fetchStaticJsonByUrl,
} from '@/utils/api'
import { setPageCache } from '@/utils/cache-setting'
import { getSectionAndTopicFromDefaultHeaderData } from '@/utils/data-process'
import { processSettledResult } from '@/utils/response-processor'

type PodcastPageProps = {
  headerData: {
    sectionsData: HeadersData
    topicsData: Topics
  }
  podcastListData: Podcast[]
}

type HeaderResponse = Awaited<
  ReturnType<typeof fetchHeaderDataInDefaultPageLayout>
>

type PodcastResponse = Awaited<ReturnType<typeof fetchStaticJsonByUrl<unknown>>>

const ALL_AUTHORS = '全部'

const AUTHORS = [
  ALL_AUTHORS,
  '鏡週刊理財組',
  '鏡週刊調查組',
  '鏡週刊社會組',
  '鏡週刊人物組',
  '鏡週刊財經組',
  '鏡週刊美食旅遊組',
  '鏡週刊娛樂產業組',
  '鏡週刊財經人物組',
  '鏡車誌',
  '鏡錶誌',
]

function groupPodcastsByAuthor(podcasts: Podcast[]): Record<string, Podcast[]> {
  return podcasts.reduce<Record<string, Podcast[]>>((grouped, podcast) => {
    const podcastsForAuthor = grouped[podcast.author] ?? []

    return {
      ...grouped,
      [podcast.author]: podcastsForAuthor.concat(podcast),
    }
  }, {})
}

export default function PodcastPage({
  headerData,
  podcastListData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [selectedPodcasts, setSelectedPodcasts] = useState<Podcast[]>([])
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [listeningPodcast, setListeningPodcast] = useState<Podcast | null>(null)

  const groupedPodcasts = groupPodcastsByAuthor(podcastListData)

  function displayPodcastsByAuthor(author: string) {
    setSelectedAuthor(author)

    if (author === ALL_AUTHORS) {
      setSelectedPodcasts(podcastListData)
      return
    }

    setSelectedPodcasts(groupedPodcasts[author] ?? [])
  }

  return (
    <Layout
      footer={{ type: 'default' }}
      head={{ title: 'Podcasts' }}
      header={{ type: 'default', data: headerData }}
    >
      <main className="mx-auto min-[768px]:w-[516px] min-[1200px]:w-[1024px]">
        <div className="flex w-full items-center justify-between px-mm-xl py-[15px] md:px-0 md:py-mm-2xl">
          <Typography
            as="h1"
            className="text-[16px] leading-[1.15] font-medium tracking-[0.5px] text-black min-[768px]:text-[20px] min-[1200px]:text-[28px] md:font-semibold"
            variant="subtitle"
          >
            Podcasts
          </Typography>
          <Dropdown
            authors={AUTHORS}
            displayPodcastsByAuthor={displayPodcastsByAuthor}
          />
        </div>
        <PodcastList
          allPodcasts={podcastListData}
          listeningPodcast={listeningPodcast}
          onPodcastSelect={setListeningPodcast}
          selectedAuthor={selectedAuthor}
          selectedPodcasts={selectedPodcasts}
        />
        {listeningPodcast && (
          <AudioPlayer listeningPodcast={listeningPodcast} />
        )}
      </main>
    </Layout>
  )
}

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
  const [headerResponse, podcastResponse] = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchStaticJsonByUrl<unknown>(URL_STATIC_PODCAST_LIST),
  ])

  const [sectionsData, topicsData] = processSettledResult<
    HeaderResponse,
    [HeadersData, Topics]
  >(
    headerResponse,
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in podcasts page',
    globalLogFields
  )

  const podcastListData = processSettledResult<PodcastResponse, Podcast[]>(
    podcastResponse,
    (response) => toPodcastListViewModel(response?.data) ?? [],
    'Error occurs while getting podcast list in podcasts page',
    globalLogFields
  )

  if (podcastListData.length === 0) {
    return { notFound: true }
  }

  return {
    props: {
      headerData: { sectionsData, topicsData },
      podcastListData,
    },
  }
}) satisfies GetServerSideProps<PodcastPageProps>
