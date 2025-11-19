// External libraries
import styled from 'styled-components'
import axios from 'axios'
import errors from '@twreporter/errors'
import dynamic from 'next/dynamic'

// Config and utilities (including hooks)
import {
  ENV,
  API_TIMEOUT,
  URL_STATIC_POST_FLASH_NEWS,
  URL_STATIC_POST_EXTERNAL,
} from '../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../utils/data-process'
import {
  getSectionNameGql,
  getSectionSlugGql,
  getArticleHref,
  getLogTraceObject,
} from '../utils'
import { processSettledResult } from '../utils/response-processor'
import { setPageCache } from '../utils/cache-setting'
import { fetchPromoteVideosList } from '../utils/api/promote-videos'
import { fetchForumHeadlines } from '../utils/api/forum-headlines'
import { useDisplayAd } from '../hooks/useDisplayAd'

// Components
import EditorChoice from '../components/index/editor-choice'
import LatestNews from '../components/index/latest-news'
import PromoVideoList from '../components/index/promo-video-list'
import ForumHeadlinesPreview from '../components/index/forum-headlines-preview'
import Layout from '../components/shared/layout'
import FullScreenAds from '../components/ads/full-screen-ads'
import { GPT_Placeholder } from '../components/ads/gpt/gpt-placeholder'

const GPTAd = dynamic(() => import('../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

// const GA_UTM_EDITOR_CHOICES = 'utm_source=mmweb&utm_medium=editorchoice'

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

const IndexContainer = styled.main`
  background-color: rgba(255, 255, 255, 1);
  max-width: ${({ theme }) => theme.layout.maxWidth.md};

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: ${({ theme }) => theme.layout.maxWidth.xl};
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
 * @param { { id: string, videoLink: string }[] } props.promoVideos
 * @param {import('../components/index/forum-headlines-preview').ExternalHeadline[]} props.forumHeadlines - Array of latest forum headlines
 * @returns {React.ReactElement}
 */
export default function Home({
  topicsData = [],
  flashNewsData = [],
  editorChoicesData = [],
  latestNewsData = [],
  sectionsData = [],
  promoVideos,
  forumHeadlines,
}) {
  const editorChoice = editorChoicesData.map((item) => {
    const sectionSlug = getSectionSlugGql(item.sections, undefined)
    const sectionName = getSectionNameGql(item.sections, undefined)
    const articleHref = getArticleHref(item.slug, item.style, undefined)
    return { sectionName, sectionSlug, articleHref, ...item }
  })

  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()

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
        <GPT_Placeholder
          shouldShowAd={shouldShowAd}
          isLogInProcessFinished={isLogInProcessFinished}
        >
          {shouldShowAd && <StyledGPTAd_HD pageKey="home" adKey="HD" />}
        </GPT_Placeholder>

        <EditorChoice editorChoice={editorChoice}></EditorChoice>
        {shouldShowAd && <StyledGPTAd_PC_B1 pageKey="home" adKey="PC_B1" />}
        {shouldShowAd && <StyledGPTAd_MB_L1 pageKey="home" adKey="MB_L1" />}
        <PromoVideoList promoVideos={promoVideos} />
        <ForumHeadlinesPreview forumHeadlines={forumHeadlines} />
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
 *
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

/** @typedef {import('axios').AxiosResponse<Record<'posts',FlashNewsData>>} AxiosResponse */

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

  const globalLogFields = getLogTraceObject(req)

  /** @type {import('../utils/api').HeadersData} */
  let sectionsData = []
  /** @type {import('../utils/api').Topics} */
  let topicsData = []
  /** @type {FlashNewsData} */
  let flashNewsData = []
  let editorChoicesData = []
  let latestNewsData = []
  let promoVideos = []
  let forumHeadlines = []

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
      fetchPromoteVideosList(),
      fetchForumHeadlines(),
    ])

    flashNewsData = processSettledResult(
      responses[0],
      (/** @type {AxiosResponse} */ axiosData) => {
        return axiosData?.data?.posts ?? []
      },
      'Error occurs while getting flash news in index page',
      globalLogFields
    )

    // handle header data
    ;[sectionsData, topicsData] = processSettledResult(
      responses[1],
      getSectionAndTopicFromDefaultHeaderData,
      'Error occurs while getting header data in index page',
      globalLogFields
    )

    promoVideos = processSettledResult(
      responses[2],
      (resData) => {
        return resData?.data?.promoteVideos || []
      },
      'Error occurs while getting promote videos data in index page',
      globalLogFields
    )

    forumHeadlines = processSettledResult(
      responses[3],
      (resData) => {
        return resData?.data?.externals || []
      },
      'Error occurs while getting forum headlines data in index page',
      globalLogFields
    )

    return {
      props: {
        topicsData,
        flashNewsData,
        editorChoicesData,
        latestNewsData,
        sectionsData,
        promoVideos,
        forumHeadlines,
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
