import errors from '@twreporter/errors'
import styled from 'styled-components'
import dynamic from 'next/dynamic'

import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { GCP_PROJECT_ID, ENV } from '../../config/index.mjs'
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
  max-width: 336px;
  max-height: 280px;
  margin: 8px auto;

  ${({ theme }) => theme.breakpoint.md} {
    margin: 24px auto;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 970px;
    max-height: 250px;
    margin: 0px auto 28px;
    order: -1;
  }
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
  max-width: 336px;
  max-height: 280px;
  margin: 20px auto 0px;

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 970px;
    max-height: 250px;
    margin: 28px auto 0px;
  }
`

const StickyGPTAd = styled(GPTAd)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  max-width: 320px;
  max-height: 50px;
  margin: auto;
  z-index: ${Z_INDEX.coverHeader};

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`
/**
 * @param {Object} props
 * @param {import('../../type/youtube').YoutubeVideo} props.video
 * @param {import('../../type/youtube').YoutubeVideo[]} props.latestVideos
 * @param {Object} props.headerData
 * @returns
 */
export default function Video({ video, latestVideos, headerData }) {
  const shouldShowAd = useDisplayAd()

  return (
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
        <YoutubeIframe videoId={video.id} gtmClassName="GTM-video-yt-play" />

        {shouldShowAd && <StyledGPTAd_HD pageKey="videohub" adKey="HD" />}

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
            <StickyGPTAd pageKey="videohub" adKey="MB_ST" />
            <FullScreenAds />
          </>
        )}
      </Wrapper>
    </Layout>
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
  const mockError = query.error === '500'

  const traceHeader = req.headers?.['x-cloud-trace-context']
  let globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
  }

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchYoutubeVideoByVideoId(videoId),
  ])

  const handledResponses = responses.map((response) => {
    if (response.status === 'fulfilled') {
      if ('data' in response.value) {
        // handle simple axios request
        return response.value.data
      }
      return response.value
    } else if (response.status === 'rejected') {
      const annotatingError = errors.helpers.wrap(
        response.reason,
        'UnhandledError',
        'Error occurs white getting video page data'
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

  // handle header data
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

  // handle fetch video data
  if (handledResponses[1]?.items?.length === 0) {
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
  const video = handledResponses[1]?.items
    ? simplifyYoutubeVideo(handledResponses[1]?.items)[0]
    : { id: videoId, channelId: '' }
  const channelId = video?.channelId

  /** @type {import('../../type/youtube').YoutubeVideo[]} */
  let latestVideos = []
  if (channelId) {
    try {
      const { data } = await fetchYoutubeLatestVideosByChannelId(channelId)
      latestVideos = simplifyYoutubeSearchedVideo(data.items)
    } catch (error) {
      const annotatingAxiosError = errors.helpers.annotateAxiosError(error)
      console.error(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(annotatingAxiosError, {
            withStack: true,
            withPayload: true,
          }),
          ...globalLogFields,
        })
      )
    }
  }

  const props = mockError
    ? {
        video: { id: videoId, channelId: '' },
        latestVideos: [],
        headerData: { sectionsData, topicsData },
      }
    : {
        video,
        latestVideos,
        headerData: { sectionsData, topicsData },
      }

  return { props }
}
