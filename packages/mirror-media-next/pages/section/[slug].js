import errors from '@twreporter/errors'
import styled from 'styled-components'

import client from '../../apollo/apollo-client'
import { fetchPosts } from '../../apollo/query/posts'
import { fetchSection } from '../../apollo/query/sections'
import SectionArticles from '../../components/shared/section-articles'
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import Layout from '../../components/shared/layout'
import GPTAd from '../../components/ads/gpt/gpt-ad'
import { Z_INDEX } from '../../constants/index'
import { SECTION_IDS } from '../../constants/index'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const SectionContainer = styled.main`
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
const SectionTitle = styled.h1`
  margin: 20px 0 16px 16px;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 500;
  color: ${
    /**
     * @param {Object} props
     * @param {String } props.sectionName
     * @param {Theme} [props.theme]
     */
    ({ sectionName, theme }) =>
      sectionName && theme.color.sectionsColor[sectionName]
        ? theme.color.sectionsColor[sectionName]
        : theme.color.brandColor.lightBlue
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

/**
 * @typedef {import('../../components/shared/section-articles').Article} Article
 * @typedef {import('../../components/shared/section-articles').Section} Section
 */

/**
 * @param {Object} props
 * @param {Article[]} props.posts
 * @param {Section} props.section
 * @param {number} props.postsCount
 * @param {Object} props.headerData
 * @returns {React.ReactElement}
 */
export default function Section({ postsCount, posts, section, headerData }) {
  //When the section is `論壇`, use the `culture` AD unit.
  const GPT_PAGE_KEY =
    section?.slug === 'mirrorcolumn'
      ? SECTION_IDS['culture']
      : SECTION_IDS[section.slug]

  return (
    <Layout
      head={{ title: `${section?.name}分類報導` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <SectionContainer>
        <StyledGPTAd pageKey={GPT_PAGE_KEY} adKey="HD" />
        <SectionTitle sectionName={section?.slug}>{section?.name}</SectionTitle>
        <SectionArticles
          postsCount={postsCount}
          posts={posts}
          section={section}
          renderPageSize={RENDER_PAGE_SIZE}
        />
        <StyledGPTAd pageKey={GPT_PAGE_KEY} adKey="FT" />
        <StickyGPTAd pageKey={GPT_PAGE_KEY} adKey="ST" />
      </SectionContainer>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ query, req }) {
  const sectionSlug = query.slug
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
    client.query({
      query: fetchPosts,
      variables: {
        take: RENDER_PAGE_SIZE * 2,
        skip: 0,
        orderBy: { publishedDate: 'desc' },
        filter: {
          state: { equals: 'published' },
          sections: { some: { slug: { equals: sectionSlug } } },
        },
      },
    }),
    client.query({
      query: fetchSection,
      variables: {
        where: { slug: sectionSlug },
      },
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
  /** @type {number} postsCount */
  const postsCount =
    'data' in handledResponses[1]
      ? handledResponses[1]?.data?.postsCount || 0
      : 0
  /** @type {Article[]} */
  const posts =
    'data' in handledResponses[1] ? handledResponses[1]?.data?.posts || [] : []
  /** @type {Section} */
  const section =
    'data' in handledResponses[2]
      ? handledResponses[2]?.data?.section || {}
      : {}

  const props = {
    postsCount,
    posts,
    section,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
