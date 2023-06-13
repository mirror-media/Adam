import errors from '@twreporter/errors'
import styled from 'styled-components'

import client from '../../apollo/apollo-client'
import ExternalArticles from '../../components/externals/partner-articles'
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import Layout from '../../components/shared/layout'

import {
  fetchExternalsByPartnerSlug,
  fetchExternalCounts,
} from '../../apollo/query/externals'
import { fetchPartnerBySlug } from '../../apollo/query/partner'
import { getExternalPartnerColor } from '../../utils/external'
import GPTAd from '../../components/ads/gpt/gpt-ad'
import { useMembership } from '../../context/membership'
import { Z_INDEX, SECTION_IDS } from '../../constants/index'

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
  max-width: 336px;
  margin: auto;
  height: 280px;
  margin-top: 20px;

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 970px;
    height: 250px;
  }
`

const StickyGPTAd = styled(GPTAd)`
  position: fixed;
  width: 100%;
  max-width: 320px;
  margin: 60px auto 0px;
  height: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${Z_INDEX.top};

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const RENDER_PAGE_SIZE = 12
const EXTERNALS_GPT_SECTION_IDS = SECTION_IDS.news // The default section of the `[partnerSlug]` page is `時事`

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
  const { isLoggedIn } = useMembership()

  return (
    <Layout
      head={{ title: `${partner?.name}相關報導` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <PartnerContainer>
        {!isLoggedIn && (
          <StyledGPTAd pageKey={EXTERNALS_GPT_SECTION_IDS} adKey="HD" />
        )}
        <PartnerTitle partnerColor={getExternalPartnerColor(partner)}>
          {partner?.name}
        </PartnerTitle>
        <ExternalArticles
          externalsCount={externalsCount}
          externals={externals}
          partner={partner}
          renderPageSize={RENDER_PAGE_SIZE}
        />
        {!isLoggedIn && (
          <StyledGPTAd pageKey={EXTERNALS_GPT_SECTION_IDS} adKey="FT" />
        )}
        {!isLoggedIn && (
          <StickyGPTAd pageKey={EXTERNALS_GPT_SECTION_IDS} adKey="ST" />
        )}
      </PartnerContainer>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ params, req }) {
  const { partnerSlug } = params
  const traceHeader = req.headers?.['x-cloud-trace-context']
  let globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
  }

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(), //fetch header data
    client.query({
      query: fetchExternalsByPartnerSlug,
      variables: {
        take: RENDER_PAGE_SIZE * 2,
        skip: 0,
        orderBy: { publishedDate: 'desc' },
        filter: {
          state: { equals: 'published' },
          partner: { slug: { equals: partnerSlug } },
        },
      },
    }),
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

  const handledResponses = responses.map((response) => {
    if (response.status === 'fulfilled') {
      return response.value
    } else if (response.status === 'rejected') {
      const { graphQLErrors, clientErrors, networkError } = response.reason
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
          debugPayload: {
            graphQLErrors,
            clientErrors,
            networkError,
          },
          ...globalLogFields,
        })
      )
      return
    }
  })

  const headerData =
    'sectionsData' in handledResponses[0]
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

  /** @type {ListingExternal[]} */
  const externals =
    'data' in handledResponses[1]
      ? handledResponses[1]?.data?.externals || []
      : []

  /** @type {number} */
  const externalsCount =
    'data' in handledResponses[2]
      ? handledResponses[2]?.data?.externalsCount || 0
      : 0

  /** @type {Partner} */
  const partner =
    'data' in handledResponses[3]
      ? handledResponses[3]?.data?.partners[0] || {}
      : {}

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
