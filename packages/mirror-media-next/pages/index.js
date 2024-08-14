import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import errors from '@twreporter/errors'
import dynamic from 'next/dynamic'
import {
  ENV,
  API_TIMEOUT,
  URL_STATIC_POST_FLASH_NEWS,
  URL_STATIC_POST_EXTERNAL,
  URL_STATIC_POPULAR_NEWS,
} from '../config/index.mjs'

import { fetchModEventsInDesc } from '../utils/api/event'
import { fetchHeaderDataInDefaultPageLayout } from '../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../utils/data-process'
import {
  getSectionNameGql,
  getSectionSlugGql,
  getArticleHref,
  getLogTraceObject,
  getActiveOrderSection,
} from '../utils'
import {
  handleAxiosResponse,
  handleGqlResponse,
} from '../utils/response-handle'
import { setPageCache } from '../utils/cache-setting'
import EditorChoice from '../components/index/editor-choice'
import LatestNews from '../components/index/latest-news'
import PopularNews from '../components/index/popular-news'
import Layout from '../components/shared/layout'
import { useDisplayAd } from '../hooks/useDisplayAd'
import FullScreenAds from '../components/ads/full-screen-ads'
import GPT_Placeholder from '../components/ads/gpt/gpt-placeholder'
import LiveYoutube from '../components/live-youtube'

import { isDateInsideDatesRange } from '../utils/date'
import TagManager from 'react-gtm-module'
const GPTAd = dynamic(() => import('../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const GA_UTM_EDITOR_CHOICES = 'utm_source=mmweb&utm_medium=editorchoice'

/**
 * @typedef {import('../components/header/share-header').HeaderData['flashNewsData']} FlashNewsData
 */
/**
 * @typedef {import('../components/header/share-header').HeaderData['sectionsData']} SectionsData
 */
/**
 * @typedef {import('../components/header/share-header').HeaderData['topicsData']} TopicsData
 */

/**
 * @typedef {import('../components/index/editor-choice').EditorChoiceRawData[]} EditorChoicesRawData
 */
/**
 * @typedef {import('../components/index/latest-news').ArticleRawData[]} ArticlesRawData
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
 * @param {'a' | 'b'} props.ABConst
 * @param {Object[]} props.popularData
 * @returns {React.ReactElement}
 */
export default function Home({
  topicsData = [],
  flashNewsData = [],
  editorChoicesData = [],
  latestNewsData = [],
  sectionsData = [],
  liveYoutubeInfo,
  ABConst,
  popularData,
}) {
  console.log('test of ab test, now it is:', ABConst)
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

  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()
  const [isHDAdEmpty, setISHDAdEmpty] = useState(true)

  const handleObSlotRenderEnded = useCallback((e) => {
    setISHDAdEmpty(e.isEmpty)
  }, [])

  useEffect(() => {
    const tagManagerArgs = {
      dataLayer: {
        event: 'pageview',
        page: {
          title: document.title,
          url: window.location.pathname,
          eventLabel: ABConst === 'b' ? 'B' : 'A',
        },
      },
    }
    TagManager.dataLayer(tagManagerArgs)
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
      <IndexContainer className={`GTM-ab-test-${ABConst}`}>
        <GPT_Placeholder
          shouldShowAd={shouldShowAd}
          isHDAdEmpty={isHDAdEmpty}
          isLogInProcessFinished={isLogInProcessFinished}
        >
          {shouldShowAd && (
            <StyledGPTAd_HD
              pageKey="home"
              adKey="HD"
              onSlotRenderEnded={handleObSlotRenderEnded}
            />
          )}
        </GPT_Placeholder>
        {/* should remove after 2024 taiwan election is finished */}
        <EditorChoice editorChoice={editorChoice}></EditorChoice>
        {shouldShowAd && <StyledGPTAd_PC_B1 pageKey="home" adKey="PC_B1" />}
        {shouldShowAd && <StyledGPTAd_MB_L1 pageKey="home" adKey="MB_L1" />}
        {ABConst === 'b' && <PopularNews popularData={popularData} />}
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
 * @typedef {Object} PopularPost
 * @property {string} id
 * @property {Array} sections
 * @property {Array} sectionsInInputOrder
 * @property {string} title
 * @property {string} slug
 * @property {string} content
 * @property {string} publishedDate
 * @property {string} updatedAt
 */

/** @typedef {import('axios').AxiosResponse<PopularPost[]>} AxiosPopularPostResponse */

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ res, req }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 180 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  const globalLogFields = getLogTraceObject(req)

  /** @type {import('../utils/api').HeadersData} */
  let sectionsData = []
  /** @type {import('../utils/api').Topics} */
  let topicsData = []
  /** @type {FlashNewsData} */
  let flashNewsData = []
  let editorChoicesData = []
  let latestNewsData = []
  let eventsData = []
  let popularData = []

  const ABConst = Math.random() < 0.5 ? 'a' : 'b'

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
      ABConst === 'b'
        ? axios({
            method: 'get',
            url: URL_STATIC_POPULAR_NEWS,
            timeout: API_TIMEOUT,
          })
        : null,
    ])

    flashNewsData = handleAxiosResponse(
      responses[0],
      (/** @type {AxiosResponse} */ axiosData) => {
        return axiosData?.data?.posts ?? []
      },
      'Error occurs while getting flash news in index page',
      globalLogFields
    )

    // handle header data
    ;[sectionsData, topicsData] = handleAxiosResponse(
      responses[1],
      getSectionAndTopicFromDefaultHeaderData,
      'Error occurs while getting header data in index page',
      globalLogFields
    )

    eventsData = handleGqlResponse(
      responses[2],
      (gqlData) => {
        return gqlData?.data?.events || []
      },
      'Error occurs while getting event data in index page',
      globalLogFields
    )

    popularData = handleAxiosResponse(
      responses[3],
      /**
       * @param {AxiosPopularPostResponse | undefined} axiosData
       * @returns {Array}
       */
      (axiosData) => {
        if (axiosData) {
          return axiosData.data
            .map((post) => {
              const sectionsWithOrdered = getActiveOrderSection(
                post.sections,
                post.sectionsInInputOrder
              )
              return { sectionsWithOrdered, ...post }
            })
            .slice(0, 6)
        }
        return []
      },
      'Error occurs while getting popular data in index page',
      globalLogFields
    )

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
        ABConst,
        popularData,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while getting data in index page'
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
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errorMessage,
        ...globalLogFields,
      })
    )
    throw new Error(errorMessage)
  }
}
