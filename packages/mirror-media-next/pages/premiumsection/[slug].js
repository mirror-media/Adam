import styled from 'styled-components'
import dynamic from 'next/dynamic'

import SectionArticles from '../../components/shared/section-articles'
import { ENV } from '../../config/index.mjs'
import { getLogTraceObject } from '../../utils'
import {
  handleAxiosResponse,
  handleGqlResponse,
} from '../../utils/response-handle'
import { fetchHeaderDataInPremiumPageLayout } from '../../utils/api'
import {
  getSectionFromPremiumHeaderData,
  getPostsAndPostscountFromGqlData,
} from '../../utils/data-process'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import {
  fetchPremiumPostsBySectionSlug,
  fetchSectionBySectionSlug,
} from '../../utils/api/premiumsection'
import { SECTION_IDS } from '../../constants/index'
import { Z_INDEX } from '../../constants/index'
import { useDisplayAd } from '../../hooks/useDisplayAd'
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
  margin: 20px auto 0;

  ${({ theme }) => theme.breakpoint.md} {
    width: 672px;
    margin: 28px auto 0;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 1024px;
    padding: 0;
    margin: 36px auto 0;
  }
`
const SectionTitle = styled.h1`
  margin: 16px 17px;
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
    font-size: 28px;
    font-weight: 600;
    display: flex;
    align-items: center;
    &::before,
    &::after {
      content: '';
      display: inline-block;
      height: 2px;
      background: black;
      flex-grow: 1;
    }
    &::before {
      margin-right: 30px;
    }
    &::after {
      margin-left: 40px;
    }
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 24px 0 28px;
    font-size: 28px;
  }
`

const StyledGPTAd_HD = styled(GPTAd)`
  width: 100%;
  height: auto;
`

const StickyGPTAd_MB_ST = styled(GPTMbStAd)`
  display: block;
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
 * @typedef {import('../../components/shared/section-articles').Article} Article
 * @typedef {import('../../components/shared/section-articles').Section} Section
 */

/**
 * @param {Object} props
 * @param {Article[]} props.posts
 * @param {Section} props.section
 * @param {number} props.postsCount
 * @param {Object} props.headerData
 *
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
      header={{ type: 'premium', data: headerData }}
      footer={{ type: 'default' }}
    >
      <SectionContainer>
        <GPT_Placeholder
          shouldShowAd={shouldShowAd}
          isHDAdEmpty={isHDAdEmpty}
          isLogInProcessFinished={isLogInProcessFinished}
        >
          {shouldShowAd && (
            <StyledGPTAd_HD
              pageKey={SECTION_IDS['member']}
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
          isPremium={true}
        />
        {shouldShowAd && <StickyGPTAd_MB_ST pageKey={SECTION_IDS['member']} />}
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
    fetchHeaderDataInPremiumPageLayout(),
    fetchPremiumPostsBySectionSlug(sectionSlug, RENDER_PAGE_SIZE * 2, 0),
    fetchSectionBySectionSlug(sectionSlug),
  ])

  // handle header data
  const sectionsData = handleAxiosResponse(
    responses[0],
    getSectionFromPremiumHeaderData,
    `Error occurs while getting premium header data in premiumsection page (sectionSlug: ${sectionSlug})`,
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
    `Error occurs while getting posts in premiumsection page (sectionSlug: ${sectionSlug})`,
    globalLogFields
  )

  if (posts.length === 0) {
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `fetch post of premiumSectionSlug ${sectionSlug} return empty posts, redirect to 404`,
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
    `Error occurs while getting sectoin data in premiumsection page (sectionSlug: ${sectionSlug})`,
    globalLogFields
  )

  const props = {
    postsCount,
    posts,
    section,
    headerData: { sectionsData },
  }

  return { props }
}
