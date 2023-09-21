import errors from '@twreporter/errors'
import dynamic from 'next/dynamic'

import { GCP_PROJECT_ID, ENV } from '../../config/index.mjs'
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
  fetchYoutubeHighestViewCountInOneWeek,
  fetchYoutubeLatestVideos,
  fetchYoutubePlaylistByChannelId,
  fetcYoutubeVideoForFullDescription,
} from '../../utils/api/section-videohub'
import { Z_INDEX } from '../../constants/index'
import { useDisplayAd } from '../../hooks/useDisplayAd'
import FullScreenAds from '../../components/ads/full-screen-ads'
import GPTMbStAd from '../../components/ads/gpt/gpt-mb-st-ad'

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

const StyledGPTAd_PC_HD = styled(GPTAd)`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    width: 100%;
    height: auto;
    margin: 20px auto 0px;
    display: block;
  }
`

const StyledGPTAd_MB_HD = styled(GPTAd)`
  width: 100%;
  height: auto;
  margin: 20px auto 0px;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
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

  const shouldShowAd = useDisplayAd()

  return (
    <Layout
      head={{ title: `影音` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <Wrapper>
        {shouldShowAd && <StyledGPTAd_PC_HD pageKey="videohub" adKey="PC_HD" />}
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
        {shouldShowAd && <StyledGPTAd_MB_HD pageKey="videohub" adKey="MB_HD" />}
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

export async function getServerSideProps({ query, req, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 900 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }
  const mockError = query.error === '500'

  const traceHeader = req.headers?.['x-cloud-trace-context']
  let globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
  }

  let responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchYoutubeHighestViewCountInOneWeek(),
    fetchYoutubeLatestVideos(),
    fetchVideohubSection(),
  ])

  let handledResponses = responses.map((response) => {
    if (response.status === 'fulfilled') {
      if ('data' in response.value) {
        // retrieve data for simple axios and gql request
        return response.value.data
      }
      return response.value
    } else if (response.status === 'rejected') {
      const annotatingError = errors.helpers.wrap(
        response.reason,
        'UnhandledError',
        'Error occurs white getting video category page data'
      )

      console.log(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(
            annotatingError,
            {
              withStack: true,
              withPayload: true,
            },
            0,
            0
          ),
          ...globalLogFields,
        })
      )
      return
    }
  })

  const headerData =
    handledResponses[0] && 'sectionsData' in handledResponses[0]
      ? handledResponses[0]
      : { sectionsData: [], topicsData: [] }
  const sectionsData = Array.isArray(headerData.sectionsData)
    ? headerData.sectionsData
    : []
  const topicsData = Array.isArray(headerData.topicsData)
    ? headerData.topicsData
    : []

  let highestViewCountVideo = handledResponses[1]?.items
    ? simplifyYoutubeSearchedVideo(handledResponses[1]?.items)[0]
    : {}

  const latestVideos = handledResponses[2]?.items
    ? simplifyYoutubeSearchedVideo(handledResponses[2]?.items)
    : []

  const categories = handledResponses[3]?.section?.categories
    ? handledResponses[3]?.section?.categories
    : []

  const channelIds = categories.map(
    (category) => VIDEOHUB_CATEGORIES_PLAYLIST_MAPPING[category.slug]
  )

  const playlistResponses = await Promise.allSettled([
    // fetch highest view count with youtube/videos to get full snippet.description
    // cause in youtube/search we only receieve truncated one
    highestViewCountVideo.id
      ? fetcYoutubeVideoForFullDescription(highestViewCountVideo.id)
      : Promise.resolve({}),
    ...channelIds.map((channelId) =>
      fetchYoutubePlaylistByChannelId(channelId)
    ),
  ])
  const handledPlaylistResponses = playlistResponses.map((response) => {
    if (response.status === 'fulfilled') {
      return response.value.data
    } else if (response.status === 'rejected') {
      const annotatingError = errors.helpers.wrap(
        response.reason,
        'UnhandledError',
        'Error occurs white getting video category page data'
      )

      console.log(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(
            annotatingError,
            {
              withStack: true,
              withPayload: true,
            },
            0,
            0
          ),
          ...globalLogFields,
        })
      )
      return
    }
  })

  highestViewCountVideo = handledPlaylistResponses[0]?.items
    ? simplifyYoutubeVideo(handledPlaylistResponses[0]?.items)[0]
    : highestViewCountVideo

  const playlistsVideos = categories.map((category, index) => ({
    ...category,
    items: simplifyYoutubePlaylistVideo(
      handledPlaylistResponses[index + 1]?.items
        ? handledPlaylistResponses[index + 1].items
            ?.filter((item) => item.status.privacyStatus === 'public')
            .slice(0, 4)
        : []
    ),
  }))

  const props = mockError
    ? {
        highestViewCountVideo: {},
        latestVideos: [],
        playlistsVideos: [],
        headerData: { sectionsData, topicsData },
      }
    : {
        highestViewCountVideo,
        latestVideos,
        playlistsVideos,
        headerData: { sectionsData, topicsData },
      }

  return { props }
}
