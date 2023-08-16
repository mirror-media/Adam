import errors from '@twreporter/errors'
import dynamic from 'next/dynamic'

import { GCP_PROJECT_ID, ENV } from '../../config/index.mjs'
import CategoryVideos from '../../components/video_category/category-videos.js'
import { VIDEOHUB_CATEGORIES_PLAYLIST_MAPPING } from '../../constants/index.js'
import styled from 'styled-components'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api/index.js'
import { simplifyYoutubePlaylistVideo } from '../../utils/youtube.js'
import { setPageCache } from '../../utils/cache-setting.js'
import LeadingVideo from '../../components/shared/leading-video.js'
import Layout from '../../components/shared/layout.js'
import {
  fetchVideoCategory,
  fetchYoutubePlaylistByPlaylistId,
} from '../../utils/api/video-category.js'
import { Z_INDEX } from '../../constants/index'
import { useDisplayAd } from '../../hooks/useDisplayAd'
import FullScreenAds from '../../components/ads/full-screen-ads'

const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const Wrapper = styled.div`
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
    max-width: 970px;
    max-height: 250px;
    display: block;
  }
`

const StyledGPTAd_MB_HD = styled(GPTAd)`
  width: 100%;
  height: auto;
  max-width: 336px;
  max-height: 280px;
  margin: 20px auto 0px;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const StickyGPTAd_MB_ST = styled(GPTAd)`
  display: block;
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
 *
 * @param {Object} props
 * @param {import('../../type/youtube.js').YoutubeVideo[]} props.videos
 * @param {string} props.ytNextPageToken
 * @param {Object} props.headerData
 * @param {Object} props.category
 * @returns
 */
export default function VideoCategory({
  videos,
  ytNextPageToken,
  headerData,
  category,
}) {
  const hasMoreThanOneVideo = videos.length > 1
  const firstVideo = videos[0]
  const remainingVideos = videos.slice(1)
  const categoryName = category.name || ''

  const shouldShowAd = useDisplayAd()

  return (
    <Layout
      head={{ title: `${categoryName}影音` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <Wrapper>
        {shouldShowAd && <StyledGPTAd_PC_HD pageKey="videohub" adKey="PC_HD" />}
        <LeadingVideo
          video={firstVideo}
          title={categoryName}
          slug={category.slug}
          gtmClassName={{
            title: 'GTM-leading-video-item',
            youtube: 'GTM-leading-video-yt-play',
          }}
        />
        {shouldShowAd && <StyledGPTAd_MB_HD pageKey="videohub" adKey="MB_HD" />}
        {hasMoreThanOneVideo && (
          <CategoryVideos
            videoItems={remainingVideos}
            initialNextPageToken={ytNextPageToken}
            categorySlug={category.slug}
          />
        )}
        {shouldShowAd && <StickyGPTAd_MB_ST pageKey="videohub" adKey="MB_ST" />}
        {shouldShowAd && <FullScreenAds />}
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
  const videoCategorySlug = Array.isArray(query.slug)
    ? query.slug[0]
    : query.slug
  const mockError = query.error === '500'

  const traceHeader = req.headers?.['x-cloud-trace-context']
  let globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
  }

  const playlistId = VIDEOHUB_CATEGORIES_PLAYLIST_MAPPING[videoCategorySlug]

  if (!playlistId) {
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `video_category page got unknown slug ${videoCategorySlug}, redirect back to section/videohub`,
        globalLogFields,
      })
    )
    return {
      redirect: {
        destination: '/section/videohub',
        permanent: false,
      },
    }
  }

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchYoutubePlaylistByPlaylistId(playlistId),
    fetchVideoCategory(videoCategorySlug),
  ])

  const handledResponses = responses.map((response) => {
    if (response.status === 'fulfilled') {
      if ('data' in response.value) {
        // handle simple axios and gql response
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

  // handle fetch videos and get nextPageToken for infinite scroll

  if (handledResponses[1]?.items?.length === 0) {
  }
  const videos = handledResponses[1]?.items
    ? simplifyYoutubePlaylistVideo(
        handledResponses[1]?.items.filter(
          /**
           * @param {import('../section/videohub.js').YoutubeRawPlaylistVideo} item
           * @returns
           */
          (item) => item.status.privacyStatus === 'public'
        )
      )
    : []
  const ytNextPageToken = handledResponses[1]?.nextPageToken || ''

  const category = handledResponses[2]?.category || { slug: videoCategorySlug }

  const props = mockError
    ? {
        videos: [],
        ytNextPageToken: '',
        headerData: { sectionsData, topicsData },
        category: { slug: videoCategorySlug },
      }
    : {
        videos,
        ytNextPageToken,
        headerData: { sectionsData, topicsData },
        category,
      }

  return { props }
}
