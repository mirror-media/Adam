import styled from 'styled-components'
import dynamic from 'next/dynamic'

import SectionArticles from '../../components/shared/section-articles'
import { ENV } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import {
  getSectionAndTopicFromDefaultHeaderData,
  getPostsAndPostscountFromGqlData,
} from '../../utils/data-process'
import { getLogTraceObject } from '../../utils'
import {
  handleAxiosResponse,
  handleGqlResponse,
} from '../../utils/response-handle'
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
import GPTMbStAd from '../../components/ads/gpt/gpt-mb-st-ad'
import GPT_Placeholder from '../../components/ads/gpt/gpt-placeholder'
import { useCallback, useState } from 'react'

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
`

const StickyGPTAd = styled(GPTMbStAd)`
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
  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()

  const [isHDAdEmpty, setISHDAdEmpty] = useState(true)

  const handleObSlotRenderEnded = useCallback((e) => {
    setISHDAdEmpty(e.isEmpty)
  }, [])

  return (
    <Layout
      head={{ title: `${sectionName}分類報導` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <SectionContainer>
        <GPT_Placeholder
          shouldShowAd={shouldShowAd}
          isHDAdEmpty={isHDAdEmpty}
          isLogInProcessFinished={isLogInProcessFinished}
        >
          {shouldShowAd && (
            <StyledGPTAd
              pageKey={getSectionGPTPageKey(section.slug)}
              adKey="HD"
              onSlotRenderEnded={handleObSlotRenderEnded}
            />
          )}
        </GPT_Placeholder>

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
          <StickyGPTAd pageKey={getSectionGPTPageKey(section.slug)} />
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

  const globalLogFields = getLogTraceObject(req)

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchPostsBySectionSlug(sectionSlug, RENDER_PAGE_SIZE * 2, 0),
    fetchSectionBySectionSlug(sectionSlug),
  ])

  // handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    `Error occurs while getting header data in section page (sectionSlug: ${sectionSlug})`,
    globalLogFields
  )

  // handle fetch post data
  /**
   * @template {Article} T
   * @type {typeof getPostsAndPostscountFromGqlData<T>}
   */
  const dataHandler = getPostsAndPostscountFromGqlData

  /** @type {[number, Article[]]} */
  const [postsCount, posts] = handleGqlResponse(
    responses[1],
    dataHandler,
    `Error occurs while getting posts in section page (sectionSlug: ${sectionSlug})`,
    globalLogFields
  )

  if (posts.length === 0) {
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

  // handle fetch section data
  /** @type {Section} */
  const section = handleGqlResponse(
    responses[2],
    (gqlData) => {
      return gqlData?.data?.section || { slug: sectionSlug }
    },
    `Error occurs while getting section data in section page (sectionSlug: ${sectionSlug})`,
    globalLogFields
  )

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
