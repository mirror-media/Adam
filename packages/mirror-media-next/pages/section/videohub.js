import dynamic from 'next/dynamic'

import { ENV } from '../../config/index.mjs'
import { VIDEOHUB_CATEGORIES_PLAYLIST_MAPPING } from '../../constants'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api/index.js'
import { setPageCache } from '../../utils/cache-setting'
import styled from 'styled-components'
import VideoList from '../../components/section/videohub/video-list.js'
import SubscribeChannels from '../../components/section/videohub/subscribe-channels.js'
import {
  simplifyYoutubePlaylistVideo,
  simplifyYoutubeSearchedVideo,
  simplifyYoutubeVideo,
} from '../../utils/youtube.js'
import LeadingVideo from '../../components/shared/leading-video.js'
import Layout from '../../components/shared/layout.js'
import {
  fetchVideohubSection,
  fetchYoutubeLatestVideos,
  fetchYoutubePlaylistByChannelId,
  fetchYoutubeVideosWithStatistics,
} from '../../utils/api/section-videohub'
import { Z_INDEX } from '../../constants/index'
import { useDisplayAd } from '../../hooks/useDisplayAd'
import FullScreenAds from '../../components/ads/full-screen-ads'
import GPTMbStAd from '../../components/ads/gpt/gpt-mb-st-ad'
import {
  GPT_Placeholder_Desktop,
  GPT_Placeholder_MobileAndTablet,
} from '../../components/ads/gpt/gpt-placeholder'
import { getLogTraceObject } from '../../utils'
import {
  handleAxiosResponse,
  handleGqlResponse,
} from '../../utils/response-handle'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'

const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

/**
 * @typedef {import('../../type/youtube.js').YoutubeRawPlaylistVideo} YoutubeRawPlaylistVideo
 * @typedef {import('../../type/youtube.js').YoutubeRawSearchedVideo} YoutubeRawSearchedVideo
 * @typedef {import('../../type/youtube.js').YoutubeVideo} YoutubeVideo
 *
 * @typedef {Object} PlaylistVideo
 * @property {YoutubeVideo[]} items
 * @property {string} name
 * @property {string} slug
 */

const Wrapper = styled.main`
  width: 320px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoint.md} {
    width: 596px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 1024px;
    padding: 0;
  }
`

const StyledGPTAd_HD = styled(GPTAd)`
  width: 100%;
  height: auto;
`

const StyledGPTAd_PC_FT = styled(GPTAd)`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    width: 100%;
    height: auto;
    margin: 20px auto 0px;
    display: block;
  }
`

const StyledGPTAd_MB_FT = styled(GPTAd)`
  width: 100%;
  height: auto;
  margin: 20px auto 0px;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const StickyGPTAd_MB_ST = styled(GPTMbStAd)`
  display: block;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  margin: auto;
  z-index: ${Z_INDEX.coverHeader};

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

/**
 * @param {Object} props
 * @param {YoutubeVideo} props.highestViewCountVideo
 * @param {YoutubeVideo[]} props.latestVideos
 * @param {PlaylistVideo[]} props.playlistsVideos
 * @param {Object} props.headerData
 * @returns {React.ReactElement}
 */
export default function SectionVideohub({
  highestViewCountVideo,
  latestVideos,
  playlistsVideos,
  headerData,
}) {
  const hasHVCVideo = Object.keys(highestViewCountVideo).length > 0
  const hasLatestVideo = latestVideos.length > 0

  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()

  return (
    <Layout
      head={{ title: `影音` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <Wrapper>
        <GPT_Placeholder_Desktop
          shouldShowAd={shouldShowAd}
          isLogInProcessFinished={isLogInProcessFinished}
        >
          {shouldShowAd && <StyledGPTAd_HD pageKey="videohub" adKey="PC_HD" />}
        </GPT_Placeholder_Desktop>
        {hasHVCVideo && (
          <LeadingVideo
            video={highestViewCountVideo}
            title="熱門影片"
            gtmClassName={{
              title: 'GTM-video-homepage-popular-item',
              youtube: 'GTM-video-homepage-popular-yt-play',
            }}
          />
        )}
        <GPT_Placeholder_MobileAndTablet
          shouldShowAd={shouldShowAd}
          isLogInProcessFinished={isLogInProcessFinished}
        >
          {shouldShowAd && <StyledGPTAd_HD pageKey="videohub" adKey="MB_HD" />}
        </GPT_Placeholder_MobileAndTablet>
        {hasLatestVideo && (
          <VideoList
            videos={latestVideos}
            name="最新影片"
            gtmClassName="GTM-video-homepage-latest-list"
          />
        )}
        <SubscribeChannels />
        {shouldShowAd && <StyledGPTAd_MB_FT pageKey="videohub" adKey="MB_FT" />}
        {playlistsVideos.map((playlistsVideo) => (
          <VideoList
            key={playlistsVideo.slug}
            videos={playlistsVideo.items}
            name={playlistsVideo.name}
            slug={playlistsVideo.slug}
            gtmClassName={`GTM-video-homepage-categorylist_${playlistsVideo.name}`}
          />
        ))}
        {shouldShowAd && <StyledGPTAd_PC_FT pageKey="videohub" adKey="PC_FT" />}
        {shouldShowAd && <StickyGPTAd_MB_ST pageKey="videohub" />}
        {shouldShowAd && <FullScreenAds />}
      </Wrapper>
    </Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  const userAgent = req.headers['user-agent']
  console.log(
    JSON.stringify({
      severity: 'DEBUG',
      message: `[Youtube] open /section/videohub with agent ${userAgent}`,
    })
  )

  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 900 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  const globalLogFields = getLogTraceObject(req)

  let responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchYoutubeLatestVideos(),
    fetchVideohubSection(),
  ])

  // handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in section/videohub page',
    globalLogFields
  )

  /**
   * fetch 50 latest videos for two usage:
   * 1. get fetch statistics for 50 videos to get the most viewed video (熱門影片)
   * 2. slice the first 4 videos for the front-end to render (最新影片)
   */
  const [latestVideos, latest50VideoIds] = handleAxiosResponse(
    responses[1],
    (
      /** @type {Awaited<ReturnType<typeof fetchYoutubeLatestVideos>>} */ axiosData
    ) => {
      if (!axiosData) return [[], '']

      const data = axiosData.data
      const latest50Videos = data?.items
        ? simplifyYoutubeSearchedVideo(data?.items)
        : []
      const latestVideos = latest50Videos.slice(0, 4)
      const latest50VideoIds = latest50Videos.map((video) => video.id).join(',')

      return [latestVideos, latest50VideoIds]
    },
    'Error occurs while getting video data in section/videohub page',
    globalLogFields
  )

  const categories = handleGqlResponse(
    responses[2],
    (gqlData) => {
      if (!gqlData) return []

      return gqlData?.data?.section?.categories || []
    },
    'Error occurs while getting categories in section/videohub page',
    globalLogFields
  )

  const channelIds = categories.map(
    (category) => VIDEOHUB_CATEGORIES_PLAYLIST_MAPPING[category.slug]
  )

  const playlistResponses = await Promise.allSettled([
    fetchYoutubeVideosWithStatistics(latest50VideoIds),
    ...channelIds.map((channelId) =>
      fetchYoutubePlaylistByChannelId(channelId)
    ),
  ])

  const highestViewCountVideo = handleAxiosResponse(
    playlistResponses[0],
    (
      /** @type {Awaited<ReturnType<typeof fetchYoutubeVideosWithStatistics>>} */ axiosData
    ) => {
      if (!axiosData) return null

      const latest50VideosWithStatistics = axiosData?.data?.items
      const highestViewCountRawVideo = latest50VideosWithStatistics.reduce(
        (popularVideo, video) => {
          return Number(popularVideo?.statistics?.viewCount) >
            Number(video.statistics?.viewCount)
            ? popularVideo
            : video
        },
        null
      )
      return simplifyYoutubeVideo([highestViewCountRawVideo])[0]
    },
    'Error occurs while getting latest 50 videos in section/videohub page',
    globalLogFields
  )

  const playlistsVideos = categories.map((category, index) => {
    const response = playlistResponses[index + 1]
    let items

    if (response) {
      items = handleAxiosResponse(
        response,
        (
          /** @type {Awaited<ReturnType<typeof fetchYoutubePlaylistByChannelId>>} */ axiosData
        ) => {
          return (
            axiosData?.data?.items?.filter(
              (item) => item.status.privacyStatus === 'public'
            ) || []
          )
        },
        `Error occurs while getting playlist(${category?.name}) in section/videohub page`,
        globalLogFields
      )
    } else {
      items = []
    }

    return {
      ...category,
      items: simplifyYoutubePlaylistVideo(items),
    }
  })

  const props = {
    highestViewCountVideo,
    latestVideos,
    playlistsVideos,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
