import errors from '@twreporter/errors'
import styled from 'styled-components'
import dynamic from 'next/dynamic'

import PartnerArticles from '../../components/externals/partner-articles'
import client from '../../apollo/apollo-client'
import { GCP_PROJECT_ID, ENV } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import { Z_INDEX } from '../../constants/index'
import { useDisplayAd } from '../../hooks/useDisplayAd'
import { getPageKeyByPartnerShowOnIndex } from '../../utils/ad'

import { fetchExternalCounts } from '../../apollo/query/externals'
import { fetchExternalsWhichPartnerIsNotShowOnIndex } from '../../utils/api/externals'

import FullScreenAds from '../../components/ads/full-screen-ads'
import GPTMbStAd from '../../components/ads/gpt/gpt-mb-st-ad'

const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const RENDER_PAGE_SIZE = 12
const WARMLIFE_DEFAULT_TITLE = '暖流'
const WARMLIFE_DEFAULT_COLOR = 'lightBlue'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const WarmLifeContainer = styled.main`
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
const WarmLifeTitle = styled.h1`
  margin: 20px 0 16px 16px;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 500;

  color: ${({ theme }) => theme.color.brandColor[WARMLIFE_DEFAULT_COLOR]};

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
  margin: 20px auto 0px;
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

/**
 * @typedef {import('../../apollo/fragments/external').ListingExternal} ListingExternal
 */

/**
 * @param {Object} props
 * @param {ListingExternal[]} props.warmLifeData
 * @param {number} props.warmLifeDataCount
 * @param {Object} props.headerData
 * @returns {React.ReactElement}
 */
export default function WarmLife({
  warmLifeData,
  warmLifeDataCount,
  headerData,
}) {
  const shouldShowAd = useDisplayAd()
  const WARMLIFE_GPT_SECTION_IDS = getPageKeyByPartnerShowOnIndex(
    warmLifeData?.[0]?.partner?.showOnIndex
  )

  return (
    <Layout
      head={{ title: `${WARMLIFE_DEFAULT_TITLE}相關報導` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <WarmLifeContainer>
        {shouldShowAd && (
          <StyledGPTAd pageKey={WARMLIFE_GPT_SECTION_IDS} adKey="HD" />
        )}
        <WarmLifeTitle>{WARMLIFE_DEFAULT_TITLE}</WarmLifeTitle>
        <PartnerArticles
          externals={warmLifeData}
          renderPageSize={RENDER_PAGE_SIZE}
          fetchExternalsFunction={fetchExternalsWhichPartnerIsNotShowOnIndex}
          externalsCount={warmLifeDataCount}
        />
        {shouldShowAd && <StickyGPTAd pageKey={WARMLIFE_GPT_SECTION_IDS} />}
        {shouldShowAd && <FullScreenAds />}
      </WarmLifeContainer>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ req, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 600 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

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
    fetchExternalsWhichPartnerIsNotShowOnIndex(1, RENDER_PAGE_SIZE),
    client.query({
      query: fetchExternalCounts,
      variables: {
        filter: {
          partner: {
            showOnIndex: {
              equals: false,
            },
          },
        },
      },
    }),
  ])
  const handledResponses = responses.map((response, index) => {
    if (response.status === 'fulfilled') {
      return response.value
    } else if (response.status === 'rejected') {
      const statusCode = response.reason.response?.status

      const annotatingError = errors.helpers.wrap(
        response.reason,
        'UnhandledError',
        'Error occurs while getting section page data'
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
      if (index === 1) {
        if (statusCode === 404) {
          // leave undefined to be checked and redirect to 404
          return
        } else {
          // fetch key data (posts) failed, redirect to 500
          throw new Error('fetch warmlife posts failed')
        }
      }
      return
    }
  })

  // handle header data
  const headerData =
    handledResponses[0] && 'sectionsData' in handledResponses[0]
      ? handledResponses[0]
      : {
          sectionsData: [],
          topicsData: [],
        }
  const sectionsData = Array.isArray(headerData.sectionsData)
    ? headerData.sectionsData
    : []
  const topicsData = Array.isArray(headerData.topicsData)
    ? headerData.topicsData
    : []

  // handle fetch warmlife post data
  if (!handledResponses[1]) {
    return { notFound: true }
  }
  const warmLifeData = Array.isArray(handledResponses[1])
    ? handledResponses[1]
    : []

  const warmLifeDataCount =
    'data' in handledResponses[2]
      ? handledResponses[2]?.data?.externalsCount || 0
      : 0

  const props = {
    warmLifeData,
    warmLifeDataCount,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
