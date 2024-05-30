import styled from 'styled-components'
import dynamic from 'next/dynamic'

import PartnerArticles from '../../components/externals/partner-articles'
import client from '../../apollo/apollo-client'
import { ENV } from '../../config/index.mjs'
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
import GPT_Placeholder from '../../components/ads/gpt/gpt-placeholder'
import { useCallback, useState } from 'react'
import { getLogTraceObject } from '../../utils'
import {
  handleAxiosResponse,
  handleGqlResponse,
} from '../../utils/response-handle'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'

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
  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()
  const WARMLIFE_GPT_SECTION_IDS = getPageKeyByPartnerShowOnIndex(
    warmLifeData?.[0]?.partner?.showOnIndex
  )
  const [isHDAdEmpty, setISHDAdEmpty] = useState(true)
  const handleObSlotRenderEnded = useCallback((e) => {
    setISHDAdEmpty(e.isEmpty)
  }, [])

  return (
    <Layout
      head={{ title: `${WARMLIFE_DEFAULT_TITLE}相關報導` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <WarmLifeContainer>
        <GPT_Placeholder
          shouldShowAd={shouldShowAd}
          isHDAdEmpty={isHDAdEmpty}
          isLogInProcessFinished={isLogInProcessFinished}
        >
          {shouldShowAd && (
            <StyledGPTAd
              pageKey={WARMLIFE_GPT_SECTION_IDS}
              adKey="HD"
              onSlotRenderEnded={handleObSlotRenderEnded}
            />
          )}
        </GPT_Placeholder>
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

  const globalLogFields = getLogTraceObject(req)

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

  // handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in externals warmlife page',
    globalLogFields
  )

  // handle fetch warmlife post data
  const warmLifeData = handleGqlResponse(
    responses[1],
    (
      /** @type {import('../../utils/api/externals').ExternalsQueryResult | undefined} */ gqlData
    ) => gqlData?.data?.externals,
    'Error occurs while getting external posts in externals warmlife page',
    globalLogFields
  )

  if (!warmLifeData) {
    return { notFound: true }
  }

  const warmLifeDataCount = handleGqlResponse(
    responses[2],
    (
      /** @type {import('@apollo/client').ApolloQueryResult<{externalsCount: number}> | undefined} */ gqlData
    ) => {
      return gqlData?.data?.externalsCount || 0
    },
    'Error occurs while getting warmLifeDataCount in externals warmlife page',
    req
  )

  const props = {
    warmLifeData,
    warmLifeDataCount,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
