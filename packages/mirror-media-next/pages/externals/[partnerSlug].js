import styled from 'styled-components'
import dynamic from 'next/dynamic'

import client from '../../apollo/apollo-client'
import ExternalArticles from '../../components/externals/partner-articles'
import { ENV } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'

import { fetchExternalCounts } from '../../apollo/query/externals'
import { fetchPartnerBySlug } from '../../apollo/query/partner'
import { getExternalPartnerColor } from '../../utils/external'
import { fetchExternalsByPartnerSlug } from '../../utils/api/externals'

import { getPageKeyByPartnerShowOnIndex } from '../../utils/ad'
import { Z_INDEX } from '../../constants/index'
import { useDisplayAd } from '../../hooks/useDisplayAd'

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

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const PartnerContainer = styled.main`
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

const PartnerTitle = styled.h1`
  margin: 20px 0 16px 16px;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 500;

  color: ${
    /**
     * @param {Object} props
     * @param {string} props.partnerColor
     */ ({ partnerColor }) => partnerColor || 'black'
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
 * @typedef {import('../../apollo/fragments/external').ListingExternal} ListingExternal
 * @typedef {import('../../apollo/fragments/partner').Partner} Partner
 */

/**
 * @param {Object} props
 * @param {ListingExternal[]} props.externals
 * @param {number} props.externalsCount
 * @param {Object} props.headerData
 * @param {Partner} props.partner
 * @returns {React.ReactElement}
 */

export default function ExternalPartner({
  externalsCount,
  externals,
  partner,
  headerData,
}) {
  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()
  const [isHDAdEmpty, setISHDAdEmpty] = useState(true)

  const handleObSlotRenderEnded = useCallback((e) => {
    setISHDAdEmpty(e.isEmpty)
  }, [])

  return (
    <Layout
      head={{ title: `${partner?.name}相關報導` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <PartnerContainer>
        <GPT_Placeholder
          shouldShowAd={shouldShowAd}
          isHDAdEmpty={isHDAdEmpty}
          isLogInProcessFinished={isLogInProcessFinished}
        >
          {shouldShowAd && (
            <StyledGPTAd
              pageKey={getPageKeyByPartnerShowOnIndex(partner?.showOnIndex)}
              adKey="HD"
              onSlotRenderEnded={handleObSlotRenderEnded}
            />
          )}
        </GPT_Placeholder>
        <PartnerTitle partnerColor={getExternalPartnerColor(partner)}>
          {partner?.name}
        </PartnerTitle>
        <ExternalArticles
          externalsCount={externalsCount}
          externals={externals}
          fetchExternalsFunction={fetchExternalsByPartnerSlug}
          renderPageSize={RENDER_PAGE_SIZE}
          partnerSlug={partner.slug}
        />
        {shouldShowAd && (
          <StickyGPTAd
            pageKey={getPageKeyByPartnerShowOnIndex(partner?.showOnIndex)}
          />
        )}
        {shouldShowAd && <FullScreenAds />}
      </PartnerContainer>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ params, req, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 600 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }
  const { partnerSlug } = params

  const globalLogFields = getLogTraceObject(req)

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(), //fetch header data
    fetchExternalsByPartnerSlug(1, RENDER_PAGE_SIZE, partnerSlug),
    client.query({
      query: fetchExternalCounts,
      variables: {
        filter: {
          state: { equals: 'published' },
          partner: { slug: { equals: partnerSlug } },
        },
      },
    }),
    client.query({
      query: fetchPartnerBySlug,
      variables: { slug: partnerSlug },
    }),
  ])

  // handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    `Error occurs while getting header data in externals partner page (partnerSlug: ${partnerSlug})`,
    globalLogFields
  )

  /** @type {ListingExternal[]} */
  const externals = handleGqlResponse(
    responses[1],
    (
      /** @type {import('../../utils/api/externals').ExternalsQueryResult | undefined} **/ gqlData
    ) => {
      return gqlData?.data?.externals || []
    },
    `Error occurs while getting external posts in externals partner page (partnerSlug: ${partnerSlug})`,
    globalLogFields
  )

  /** @type {number} */
  const externalsCount = handleGqlResponse(
    responses[2],
    (
      /** @type {import('@apollo/client').ApolloQueryResult<{externalsCount: number}> | undefined} */ gqlData
    ) => {
      return gqlData?.data?.externalsCount || 0
    },
    `Error occurs while getting externalsCount in externals partner page (partnerSlug: ${partnerSlug})`,
    globalLogFields
  )

  /** @type {Partner} */
  const partner = handleGqlResponse(
    responses[3],
    (gqlData) => {
      return gqlData?.data?.partners?.[0] ?? {}
    },
    `Error occurs while getting partners data in externals partner page (partnerSlug: ${partnerSlug})`,
    globalLogFields
  )

  if (!Object.keys(partner).length) {
    return { notFound: true }
  }

  const props = {
    externalsCount,
    externals,
    partner,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
