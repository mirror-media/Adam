import errors from '@twreporter/errors'
import styled from 'styled-components'
import dynamic from 'next/dynamic'

import SectionTopics from '../../components/section/topic/section-topics'
import { GCP_PROJECT_ID, ENV } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import { fetchTopicList } from '../../utils/api/section-topic'
import { Z_INDEX } from '../../constants/index'
import { useDisplayAd } from '../../hooks/useDisplayAd'
import FullScreenAds from '../../components/ads/full-screen-ads'
import GPTMbStAd from '../../components/ads/gpt/gpt-mb-st-ad'
import GPT_Placeholder from '../../components/ads/gpt/gpt-placeholder'
import { useCallback, useState } from 'react'
import GPT_TranslateContainer from '../../components/ads/gpt/gpt-translate-container'

const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const TopicsContainer = styled.main`
  width: 320px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoint.md} {
    width: 672px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 1024px;
    padding: 0;
  }
`
const TopicsTitle = styled.h1`
  margin: 20px 0 16px 16px;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 500;
  color: ${
    /**
     * @param {Object} props
     * @param {Theme} [props.theme]
     */
    ({ theme }) => theme.color.brandColor.lightBlue
  };
  ${({ theme }) => theme.breakpoint.md} {
    margin: 20px 0 24px;
    font-size: 20.8px;
    font-weight: 600;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 24px 0 28px;
    font-size: 28px;
  }
`

const StyledGPTAd = styled(GPTAd)`
  width: 100%;
  height: auto;
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

const RENDER_PAGE_SIZE = 12

/**
 * @typedef {import('../../components/section/topic/section-topics').Topic} Topic
 */

/**
 * @param {Object} props
 * @param {Topic[]} props.topics
 * @param {number} props.topicsCount
 * @param {Object} props.headerData
 * @returns {React.ReactElement}
 */
export default function Topics({ topics, topicsCount, headerData }) {
  const shouldShowAd = useDisplayAd()
  const [isHDAdEmpty, setISHDAdEmpty] = useState(true)
  const handleObSlotRenderEnded = useCallback((e) => {
    setISHDAdEmpty(e.isEmpty)
  }, [])

  return (
    <Layout
      head={{ title: `精選專區` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <TopicsContainer>
        <GPT_Placeholder>
          {shouldShowAd && (
            <StyledGPTAd
              pageKey="other"
              adKey="HD"
              onSlotRenderEnded={handleObSlotRenderEnded}
            />
          )}
        </GPT_Placeholder>
        <GPT_TranslateContainer shouldTranslate={!shouldShowAd || isHDAdEmpty}>
          <>
            <TopicsTitle>精選專區</TopicsTitle>
            <SectionTopics
              topicsCount={topicsCount}
              topics={topics}
              renderPageSize={RENDER_PAGE_SIZE}
            />
          </>
        </GPT_TranslateContainer>
        {shouldShowAd && <StickyGPTAd pageKey="other" />}
        {shouldShowAd && <FullScreenAds />}
      </TopicsContainer>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ req, query, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 600 }, req.url)
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

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchTopicList(RENDER_PAGE_SIZE * 2, mockError ? NaN : 0),
  ])

  const handledResponses = responses.map((response, index) => {
    if (response.status === 'fulfilled') {
      if ('data' in response.value) {
        // handle gql requests
        return response.value.data
      }
      return response.value
    } else if (response.status === 'rejected') {
      const { graphQLErrors, clientErrors, networkError } = response.reason
      const annotatingError = errors.helpers.wrap(
        response.reason,
        'UnhandledError',
        'Error occurs while getting section/topic page data'
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
          debugPayload: {
            graphQLErrors,
            clientErrors,
            networkError,
          },
          ...globalLogFields,
        })
      )
      if (index === 1) {
        // fetch key data (topics) failed, redirect to 500
        throw new Error('fetch topics failed')
      }
      return
    }
  })

  // handle fetch header data
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

  // handle fetch topics
  if (handledResponses[1]?.topics?.length === 0) {
    // fetchTopic return empty array -> something wrong -> 404
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `fetch topics return empty posts, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }
  /** @type {number} */
  const topicsCount = handledResponses[1]?.topicsCount || 0
  /** @type {Topic[]} */
  const topics = handledResponses[1]?.topics || []

  const props = {
    topics,
    topicsCount,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
