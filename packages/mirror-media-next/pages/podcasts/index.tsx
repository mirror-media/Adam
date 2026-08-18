import { useState } from 'react'
import type { GetServerSideProps } from 'next'

import GDPRNotification from '@/components/gdpr'
import IdleTimeoutModal from '@/components/idle-modal/idle-timeout-modal'
import AudioPlayer from '@/components/podcast/audio-player'
import Dropdown from '@/components/podcast/author-select-dropdown'
import PodcastList from '@/components/podcast/podcast-list'
import CustomHead from '@/components/shared/custom-head'
import { ApplicationShell } from '@/components/shell/application-shell'
import { SiteFooter } from '@/components/shell/footer/site-footer'
import { SiteHeader } from '@/components/shell/header/site-header'
import { Typography } from '@/components/ui/typography'
import { ENV } from '@/config/index.mjs'
import { fetchPodcastList } from '@/modules/podcast/podcast-data'
import type { Podcast } from '@/modules/podcast/podcast-types'
import { getLogTraceObject } from '@/utils'
import type {
  HeadersDataSection,
  ShellFlashNews,
  ShellSectionPosts,
  Topics,
} from '@/utils/api'
import {
  fetchShellFlashNews,
  fetchShellNavigationData,
  fetchShellSectionPosts,
  fetchShellTopicsData,
} from '@/utils/api'
import { setPageCache } from '@/utils/cache-setting'
import { processSettledResult } from '@/utils/response-processor'

type PodcastPageProps = {
  headerData: {
    flashNewsData: ShellFlashNews[]
    navigationData: HeadersDataSection[]
    sectionPostsData: ShellSectionPosts
    topicsData: Topics
  }
  podcastListData: Podcast[]
}

type PodcastResponse = Awaited<ReturnType<typeof fetchPodcastList>>

type NavigationResponse = Awaited<ReturnType<typeof fetchShellNavigationData>>

type TopicsResponse = Awaited<ReturnType<typeof fetchShellTopicsData>>

type FlashNewsResponse = Awaited<ReturnType<typeof fetchShellFlashNews>>

type SectionPostsResponse = Awaited<ReturnType<typeof fetchShellSectionPosts>>

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
}: PodcastPageProps) {
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
    <>
      <CustomHead title="Podcasts" />
      <ApplicationShell
        footer={<SiteFooter />}
        globalModal={<IdleTimeoutModal />}
        header={
          <SiteHeader
            flashNewsData={headerData.flashNewsData}
            navigationData={headerData.navigationData}
            sectionPostsData={headerData.sectionPostsData}
            topicsData={headerData.topicsData}
          />
        }
        privacyNotice={<GDPRNotification />}
      >
        <main className="mx-auto w-full legacy-md:w-[516px] legacy-xl:w-[1024px]">
          <div className="flex w-full items-center justify-between px-mm-xl py-[15px] legacy-md:px-0 legacy-md:py-mm-2xl">
            <Typography
              as="h1"
              className="text-[16px] leading-[1.15] font-medium tracking-[0.5px] text-black legacy-md:text-[20px] legacy-md:font-semibold legacy-xl:text-[28px]"
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
      </ApplicationShell>
    </>
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
  const [
    topicsResponse,
    navigationResponse,
    flashNewsResponse,
    sectionPostsResponse,
    podcastResponse,
  ] = await Promise.allSettled([
    fetchShellTopicsData(),
    fetchShellNavigationData(),
    fetchShellFlashNews(),
    fetchShellSectionPosts(),
    fetchPodcastList(),
  ])

  const topicsData = processSettledResult<TopicsResponse, Topics>(
    topicsResponse,
    (value) => value ?? [],
    'Error occurs while getting shell topics data in podcasts page',
    globalLogFields
  )

  const navigationData = processSettledResult<
    NavigationResponse,
    HeadersDataSection[]
  >(
    navigationResponse,
    (value) => value ?? [],
    'Error occurs while getting shell navigation data in podcasts page',
    globalLogFields
  )

  const flashNewsData = processSettledResult<
    FlashNewsResponse,
    ShellFlashNews[]
  >(
    flashNewsResponse,
    (value) => value ?? [],
    'Error occurs while getting shell flash news in podcasts page',
    globalLogFields
  )

  const sectionPostsData = processSettledResult<
    SectionPostsResponse,
    ShellSectionPosts
  >(
    sectionPostsResponse,
    (value) => value ?? {},
    'Error occurs while getting shell section posts in podcasts page',
    globalLogFields
  )

  const podcastListData = processSettledResult<PodcastResponse, Podcast[]>(
    podcastResponse,
    (podcasts) => podcasts ?? [],
    'Error occurs while getting podcast list in podcasts page',
    globalLogFields
  )

  if (podcastListData.length === 0) {
    return { notFound: true }
  }

  return {
    props: {
      headerData: {
        flashNewsData,
        navigationData,
        sectionPostsData,
        topicsData,
      },
      podcastListData,
    },
  }
}) satisfies GetServerSideProps<PodcastPageProps>
