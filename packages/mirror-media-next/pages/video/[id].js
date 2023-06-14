import errors from '@twreporter/errors'
import styled from 'styled-components'
import axios from 'axios'

import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { GCP_PROJECT_ID, URL_RESTFUL_SERVER } from '../../config/index.mjs'
import {
  simplifyYoutubeSearchedVideo,
  simplifyYoutubeVideo,
} from '../../utils/youtube'
import YoutubeIframe from '../../components/shared/youtube-iframe'
import YoutubeArticle from '../../components/video/youtube-article'
import VideoList from '../../components/video/video-list'
import YoutubePolicy from '../../components/shared/youtube-policy'
import Layout from '../../components/shared/layout'
import GPTAd from '../../components/ads/gpt/gpt-ad'
import { Z_INDEX } from '../../constants/index'

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
  max-width: 336px;
  height: 280px;
  margin: 8px auto;

  ${({ theme }) => theme.breakpoint.md} {
    margin: 24px auto;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 970px;
    height: 250px;
    margin: 0px auto 28px;
    order: -1;
  }
`

const StyledGPTAd_E1 = styled(GPTAd)`
  width: 100%;
  max-width: 336px;
  height: 280px;
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
  max-width: 336px;
  height: 280px;
  margin: 20px auto 0px;

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 970px;
    height: 250px;
    margin: 28px auto 0px;
  }
`

const StickyGPTAd = styled(GPTAd)`
  position: fixed;
  width: 100%;
  max-width: 320px;
  margin: auto;
  height: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${Z_INDEX.top};

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
  return (
    <Layout
      head={{
        title: `${video?.title}`,
        description: video?.description,
        imageUrl: video?.thumbnail,
      }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <Wrapper>
        <YoutubeIframe videoId={video.id} />
        <StyledGPTAd_HD pageKey="videohub" adKey="HD" />
        <ContentWrapper>
          <YoutubeArticle video={video} />
          <StyledGPTAd_E1 pageKey="videohub" adKey="E1" />
          <VideoList videos={latestVideos} />
        </ContentWrapper>
        <YoutubePolicy />
        <StyledGPTAd_FT pageKey="videohub" adKey="FT" />
        <StickyGPTAd pageKey="videohub" adKey="ST" />
      </Wrapper>
    </Layout>
  )
}

export async function getServerSideProps({ query, req }) {
  const videoId = query.id
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
    axios({
      method: 'get',
      url: `${URL_RESTFUL_SERVER}/youtube/videos`,
      // use URLSearchParams to add two values for key 'part'
      params: new URLSearchParams([
        ['id', videoId],
        ['part', 'snippet'],
        ['part', 'status'],
        ['maxResults', '1'],
      ]),
    }),
  ])

  const handledResponses = responses.map((response) => {
    if (response.status === 'fulfilled') {
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

  const video =
    handledResponses[1] && 'data' in handledResponses[1]
      ? simplifyYoutubeVideo(handledResponses[1]?.data?.items)[0]
      : { channelId: '' }
  if (!video) {
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
        premanent: false,
      },
    }
  }
  const channelId = video?.channelId

  /** @type {import('../../type/youtube').YoutubeVideo[]} */
  let latestVideos = []
  if (channelId) {
    try {
      const { data } = await axios({
        method: 'get',
        url: `${URL_RESTFUL_SERVER}/youtube/search`,
        // use URLSearchParams to add two values for key 'part'
        params: new URLSearchParams([
          ['channelId', channelId],
          ['part', 'snippet'],
          ['order', 'date'],
          ['maxResults', '6'],
        ]),
      })
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

  const props = {
    video,
    latestVideos,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
