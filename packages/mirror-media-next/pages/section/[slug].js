import errors from '@twreporter/errors'
import styled from 'styled-components'
import dynamic from 'next/dynamic'

import SectionArticles from '../../components/shared/section-articles'
import { GCP_PROJECT_ID, ENV } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import { Z_INDEX } from '../../constants/index'
import {
  fetchPostsBySectionSlug,
  fetchSectionBySectionSlug,
} from '../../utils/api/section'
import { useDisplayAd } from '../../hooks/useDisplayAd'
import { getSectionGPTPageKey } from '../../utils/ad'
import FullScreenAds from '../../components/ads/full-screen-ads'

const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

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
  height: auto;
  max-width: 336px;
  max-height: 280px;
  margin: 20px auto 0px;

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 970px;
    max-height: 250px;
  }
`

const StickyGPTAd = styled(GPTAd)`
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
  const sectionName = section.name || ''
  const shouldShowAd = useDisplayAd()

  return (
    <Layout
      head={{ title: `${sectionName}分類報導` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <SectionContainer>
        {shouldShowAd && (
          <StyledGPTAd
            pageKey={getSectionGPTPageKey(section.slug)}
            adKey="HD"
          />
        )}

        {sectionName && (
          <SectionTitle sectionName={section.slug}>{sectionName}</SectionTitle>
        )}

        <SectionArticles
          postsCount={postsCount}
          posts={posts}
          section={section}
          renderPageSize={RENDER_PAGE_SIZE}
        />

        {shouldShowAd && (
          <StickyGPTAd
            pageKey={getSectionGPTPageKey(section.slug)}
            adKey="MB_ST"
          />
        )}
        {shouldShowAd && <FullScreenAds />}
      </SectionContainer>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ query, req, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 600 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }
  const sectionSlug = Array.isArray(query.slug) ? query.slug[0] : query.slug
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
    fetchPostsBySectionSlug(
      sectionSlug,
      RENDER_PAGE_SIZE * 2,
      mockError ? NaN : 0
    ),
    fetchSectionBySectionSlug(sectionSlug),
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
      if (index === 1) {
        // fetch key data (posts) failed, redirect to 500
        throw new Error('fetch section posts failed')
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

  // handle fetch post data
  if (handledResponses[1]?.posts?.length === 0) {
    // fetchPost return empty array -> wrong authorId -> 404
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `fetch post of sectionSlug ${sectionSlug} return empty posts, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }
  /** @type {number} postsCount */
  const postsCount = handledResponses[1]?.postsCount || 0
  /** @type {Article[]} */
  const posts = handledResponses[1]?.posts || []

  // handle fetch section data
  /** @type {Section} */
  const section = handledResponses[2]?.section || { slug: sectionSlug }

  // handle section state, if `inactive` -> redirect to 404
  if (section.state !== 'active') {
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `sectionSlug '${sectionSlug}' is inactive, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }

  const props = {
    postsCount,
    posts,
    section,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
