import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import errors from '@twreporter/errors'
import dynamic from 'next/dynamic'
import {
  ENV,
  API_TIMEOUT,
  URL_STATIC_POST_FLASH_NEWS,
  URL_STATIC_POST_EXTERNAL,
  GCP_PROJECT_ID,
} from '../config/index.mjs'

import { fetchModEventsInDesc } from '../utils/api/event'
import { fetchHeaderDataInDefaultPageLayout } from '../utils/api'
import { getSectionNameGql, getSectionSlugGql, getArticleHref } from '../utils'
import { setPageCache } from '../utils/cache-setting'
import EditorChoice from '../components/editor-choice'
import LatestNews from '../components/latest-news'
import Layout from '../components/shared/layout'
import { useDisplayAd } from '../hooks/useDisplayAd'
import FullScreenAds from '../components/ads/full-screen-ads'
import GPT_Placeholder from '../components/ads/gpt/gpt-placeholder'
import LiveYoutube from '../components/live-youtube'
import { isDateInsideDatesRange } from '../utils/date'
const GPTAd = dynamic(() => import('../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const GA_UTM_EDITOR_CHOICES = 'utm_source=mmweb&utm_medium=editorchoice'

/**
 * @typedef {import('../components/shared/share-header').HeaderData['flashNewsData']} FlashNewsData
 */
/**
 * @typedef {import('../components/shared/share-header').HeaderData['sectionsData']} SectionsData
 */
/**
 * @typedef {import('../components/shared/share-header').HeaderData['topicsData']} TopicsData
 */

/**
 * @typedef {import('../components/editor-choice').EditorChoiceRawData[]} EditorChoicesRawData
 */
/**
 * @typedef {import('../components/latest-news').ArticleRawData[]} ArticlesRawData
 */
/**
 * @typedef {import('../components/live-youtube').LiveYoutubeInfo} LiveYoutubeInfo
 */

const IndexContainer = styled.main`
  background-color: rgba(255, 255, 255, 1);
  max-width: 596px;

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 1024px;
  }
  margin: 0 auto;
`

const StyledGPTAd_HD = styled(GPTAd)`
  width: 100%;
  height: auto;
`

const StyledGPTAd_PC_B1 = styled(GPTAd)`
  width: 100%;
  height: auto;
  margin: 20px auto 0px;
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 728px;
    max-height: 90px;
    display: block;
  }
`

const StyledGPTAd_MB_L1 = styled(GPTAd)`
  width: 100%;
  height: auto;
  max-width: 336px;
  max-height: 280px;
  margin: 20px auto 0px;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

/**
 *
 * @param {Object} props
 * @param {TopicsData} props.topicsData
 * @param {FlashNewsData} props.flashNewsData
 * @param {EditorChoicesRawData} [props.editorChoicesData=[]]
 * @param {ArticlesRawData} [props.latestNewsData=[]]
 * @param {Object[] } props.sectionsData
 * @param {LiveYoutubeInfo} props.liveYoutubeInfo
 * @returns {React.ReactElement}
 */
export default function Home({
  topicsData = [],
  flashNewsData = [],
  editorChoicesData = [],
  latestNewsData = [],
  sectionsData = [],
  liveYoutubeInfo,
}) {
  const editorChoice = editorChoicesData.map((item) => {
    const sectionSlug = getSectionSlugGql(item.sections, undefined)
    const sectionName = getSectionNameGql(item.sections, undefined)
    const articleHref =
      item.style !== 'projects'
        ? `${getArticleHref(
            item.slug,
            item.style,
            undefined
          )}?${GA_UTM_EDITOR_CHOICES}`
        : getArticleHref(item.slug, item.style, undefined)
    return { sectionName, sectionSlug, articleHref, ...item }
  })

  const shouldShowAd = useDisplayAd()
  const [isHDAdEmpty, setISHDAdEmpty] = useState(true)

  const handleObSlotRenderEnded = useCallback((e) => {
    setISHDAdEmpty(e.isEmpty)
  }, [])

  return (
    <Layout
      header={{
        type: 'default-with-flash-news',
        data: { sectionsData, topicsData, flashNewsData },
      }}
      footer={{
        type: 'default',
      }}
    >
      <IndexContainer>
        <GPT_Placeholder shouldTranslate={!shouldShowAd || isHDAdEmpty}>
          {shouldShowAd && (
            <StyledGPTAd_HD
              pageKey="home"
              adKey="HD"
              onSlotRenderEnded={handleObSlotRenderEnded}
            />
          )}
        </GPT_Placeholder>
        <EditorChoice editorChoice={editorChoice}></EditorChoice>
        {shouldShowAd && <StyledGPTAd_PC_B1 pageKey="home" adKey="PC_B1" />}
        {shouldShowAd && <StyledGPTAd_MB_L1 pageKey="home" adKey="MB_L1" />}
        <LiveYoutube liveYoutubeInfo={liveYoutubeInfo} />
        <LatestNews latestNewsData={latestNewsData} />
        <FullScreenAds />
      </IndexContainer>
    </Layout>
  )
}

/**
 * @typedef {Object[]} Items
 */

/**
 * @typedef {Object} DataRes
 * @property {FlashNewsData} [posts]
 * @property {TopicsData} [topics]
 * @property {SectionsData} [sections]
 */

//TODO: rename typedef, make it more clear
/**
 * @typedef {Object} PostRes
 * @property {string} timestamp
 * @property {Array} choices
 * @property {Array} latest
 */

/** @typedef {import('axios').AxiosResponse<DataRes>} AxiosResponse */

//TODO: rename typedef, make it more clear
/** @typedef {import('axios').AxiosResponse<PostRes>} AxiosPostResponse */

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ res, req }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 180 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  const headers = req?.headers
  const traceHeader = headers?.['x-cloud-trace-context']

  let globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
  }

  let topicsData = []
  let flashNewsData = []
  let editorChoicesData = []
  let latestNewsData = []
  let sectionsData = []
  let eventsData = []
  try {
    const postResponse = await axios({
      method: 'get',
      url: `${URL_STATIC_POST_EXTERNAL}01.json`,
      timeout: 5000, //since size of json file is large, we assign timeout as 5000ms to prevent content lost in poor network condition
    })
    editorChoicesData = Array.isArray(postResponse?.data?.choices)
      ? postResponse?.data?.choices
      : []

    latestNewsData = Array.isArray(postResponse?.data?.latest)
      ? postResponse?.data?.latest
      : []

    const responses = await Promise.allSettled([
      axios({
        method: 'get',
        url: URL_STATIC_POST_FLASH_NEWS,
        timeout: API_TIMEOUT,
      }),
      fetchHeaderDataInDefaultPageLayout(),
      fetchModEventsInDesc(),
    ])

    responses.forEach((response, index) => {
      if (response.status === 'fulfilled') {
        //TODO: because `fetchHeaderDataInDefaultPageLayout` will not return `value` which contain `request?.res?.responseUrl`,
        //so we temporarily comment the console to prevent error.
        // console.log(
        //   JSON.stringify({
        //     severity: 'INFO',
        //     message: `Successfully fetch data on ${response.value?.request?.res?.responseUrl}`,
        //   })
        // )
      } else {
        const rejectedReason = response.reason
        const annotatingAxiosError =
          errors.helpers.annotateAxiosError(rejectedReason)
        const errorMessage = errors.helpers.printAll(
          annotatingAxiosError,
          {
            withStack: true,
            withPayload: false,
          },
          0,
          0
        )
        console.error(
          index,
          JSON.stringify({
            severity: 'ERROR',
            message: errorMessage,
            ...globalLogFields,
          })
        )
      }
    })

    /** @type {PromiseFulfilledResult<AxiosResponse>} */
    const flashNewsResponse =
      responses[0].status === 'fulfilled' && responses[0]

    const headerDataResponse =
      responses[1].status === 'fulfilled' && responses[1]

    const eventsResponse = responses[2].status === 'fulfilled' && responses[2]

    flashNewsData = Array.isArray(flashNewsResponse.value?.data?.posts)
      ? flashNewsResponse.value?.data?.posts
      : []

    sectionsData = Array.isArray(headerDataResponse.value?.sectionsData)
      ? headerDataResponse.value?.sectionsData
      : []
    topicsData = Array.isArray(headerDataResponse.value?.topicsData)
      ? headerDataResponse.value?.topicsData
      : []

    eventsData = Array.isArray(eventsResponse.value?.data?.events)
      ? eventsResponse.value?.data?.events
      : []

    const eventData =
      eventsData.find((event) =>
        // since the events are ordered in `publishedDate` with desc order,
        // find the first event whose period is on-going.
        isDateInsideDatesRange(new Date(), {
          startDate: event.startDate,
          endDate: event.endDate,
        })
      ) || {}
    // live youtube video link should be like https://www.youtube.com/watch?v={youtubeVideoId}
    // ignore other deprecated format
    const liveYoutubeInfo = eventData.link?.includes('v=')
      ? {
          youtubeId: eventData.link.split('v=')[1],
          name: eventData.name,
        }
      : {}

    return {
      props: {
        topicsData,
        flashNewsData,
        editorChoicesData,
        latestNewsData,
        sectionsData,
        liveYoutubeInfo,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while getting index page data'
    )
    const errorMessage = errors.helpers.printAll(
      annotatingError,
      {
        withStack: true,
        withPayload: false,
      },
      0,
      0
    )
    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: errorMessage,
        ...globalLogFields,
      })
    )
    throw new Error(errorMessage)
  }
}
