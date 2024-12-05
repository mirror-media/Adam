import styled from 'styled-components'
import dynamic from 'next/dynamic'

import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import { ENV } from '../../config/index.mjs'
import {
  simplifyYoutubeSearchedVideo,
  simplifyYoutubeVideo,
} from '../../utils/youtube'
import { setPageCache } from '../../utils/cache-setting'
import YoutubeIframe from '../../components/shared/youtube-iframe'
import YoutubeArticle from '../../components/video/youtube-article'
import VideoList from '../../components/video/video-list'
import YoutubePolicy from '../../components/shared/youtube-policy'
import Layout from '../../components/shared/layout'
import { Z_INDEX } from '../../constants/index'
import { useDisplayAd } from '../../hooks/useDisplayAd'
import {
  fetchYoutubeLatestVideosByChannelId,
  fetchYoutubeVideoByVideoId,
} from '../../utils/api/video'
import FullScreenAds from '../../components/ads/full-screen-ads'
import GPTMbStAd from '../../components/ads/gpt/gpt-mb-st-ad'
import {
  GPT_Placeholder_Desktop,
  GPT_Placeholder_MobileAndTablet,
} from '../../components/ads/gpt/gpt-placeholder'
import Head from 'next/head'
import { getLogTraceObject } from '../../utils'
import { handleAxiosResponse } from '../../utils/response-handle'
import { logAxiosError } from '../../utils/log/shared'

const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const Wrapper = styled.main`
  width: 320px;
  margin: 28px auto 0;

  ${({ theme }) => theme.breakpoint.md} {
    width: 596px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 1024px;
    padding: 0;
    display: grid;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0 40px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 24px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    flex-direction: row;
    margin-top: 40px;
    column-gap: 48px;
  }
`
const StyledGPTAd_HD = styled(GPTAd)`
  width: 100%;
  height: auto;
`

const StyledGPTAd_E1 = styled(GPTAd)`
  width: 100%;
  height: auto;

  margin: 20px auto 0px;

  ${({ theme }) => theme.breakpoint.md} {
    margin: 40px auto 0px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const StyledGPTAd_FT = styled(GPTAd)`
  width: 100%;
  height: auto;
  margin: 20px auto 0px;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 28px auto 0px;
  }
`

const StickyGPTAd = styled(GPTMbStAd)`
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

const GPT_PLACEHOLDER_SIZES = {
  mobile: { width: '300px', height: '350px', margin: '8px auto' },
  tablet: { width: '300px', height: '350px', margin: '24px auto' },
  desktop: { width: '970px', height: '250px', margin: '0px auto 28px' },
}

/**
 * @param {Object} props
 * @param {import('../../type/youtube').YoutubeVideo} props.video
 * @param {import('../../type/youtube').YoutubeVideo[]} props.latestVideos
 * @param {Object} props.headerData
 * @returns
 */
export default function Video({ video, latestVideos, headerData }) {
  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()

  return (
    <>
      <Head>
        <meta property="section:name" content="影音" key="section:name" />
        <meta property="section:slug" content="videohub" key="section:slug" />
      </Head>
      <Layout
        head={{
          title: `${video?.title || ''}`,
          description: video?.description || '',
          imageUrl: video?.thumbnail || '',
        }}
        header={{ type: 'default', data: headerData }}
        footer={{ type: 'default' }}
      >
        <Wrapper>
          <GPT_Placeholder_Desktop
            rwd={GPT_PLACEHOLDER_SIZES}
            shouldShowAd={shouldShowAd}
            isLogInProcessFinished={isLogInProcessFinished}
          >
            {shouldShowAd && (
              <StyledGPTAd_HD pageKey="videohub" adKey="PC_HD" />
            )}
          </GPT_Placeholder_Desktop>
          <YoutubeIframe videoId={video.id} gtmClassName="GTM-video-yt-play" />

          <GPT_Placeholder_MobileAndTablet
            rwd={GPT_PLACEHOLDER_SIZES}
            shouldShowAd={shouldShowAd}
            isLogInProcessFinished={isLogInProcessFinished}
          >
            {shouldShowAd && (
              <StyledGPTAd_HD pageKey="videohub" adKey="MB_HD" />
            )}
          </GPT_Placeholder_MobileAndTablet>

          <ContentWrapper>
            <YoutubeArticle video={video} />
            {shouldShowAd && <StyledGPTAd_E1 pageKey="videohub" adKey="E1" />}
            {latestVideos.length > 0 && (
              <VideoList
                videos={latestVideos}
                gtmClassName="GTM-video-latest-list"
              />
            )}
          </ContentWrapper>

          <YoutubePolicy />

          {shouldShowAd && (
            <>
              <StyledGPTAd_FT pageKey="videohub" adKey="FT" />
              <StickyGPTAd pageKey="videohub" />
              <FullScreenAds />
            </>
          )}
        </Wrapper>
      </Layout>
    </>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ query, req, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 900 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }
  const videoId = Array.isArray(query.id) ? query.id[0] : query.id

  const userAgent = req.headers['user-agent']
  console.log(
    JSON.stringify({
      severity: 'DEBUG',
      message: `[Youtube] open /video/${videoId} with agent ${userAgent}`,
    })
  )

  const globalLogFields = getLogTraceObject(req)

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchYoutubeVideoByVideoId(videoId),
  ])

  // handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    `Error occurs while getting header data in video page (videoId: ${videoId})`,
    globalLogFields
  )

  // handle fetch video data
  const videos = handleAxiosResponse(
    responses[1],
    (
      /** @type {Awaited<ReturnType<typeof fetchYoutubeVideoByVideoId>>} */ axiosData
    ) => {
      return axiosData ? axiosData.data?.items : []
    },
    `Error occurs while getting video data in video page (videoId: ${videoId})`,
    globalLogFields
  )

  if (videos.length === 0) {
    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: `/video/${videoId} can't not get video from youtube api`,
        ...globalLogFields,
      })
    )
    return {
      redirect: {
        destination: '/section/videohub',
        permanent: false,
      },
    }
  }

  const video = simplifyYoutubeVideo(videos)[0]

  const channelId = video.channelId

  /** @type {import('../../type/youtube').YoutubeVideo[]} */
  let latestVideos = []

  try {
    const { data } = await fetchYoutubeLatestVideosByChannelId(channelId)
    latestVideos = simplifyYoutubeSearchedVideo(data.items)
  } catch (error) {
    logAxiosError(
      error,
      `Error occurs while getting latest videos of channel (${channelId}) in video page (videoId: ${videoId})`,
      globalLogFields
    )
  }

  const props = {
    video,
    latestVideos,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
