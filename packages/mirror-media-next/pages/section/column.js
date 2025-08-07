import styled from 'styled-components'
import dynamic from 'next/dynamic'

import { ENV } from '../../config/index.mjs'
import {
  fetchColumnSectionPosts,
  fetchHeaderDataInDefaultPageLayout,
} from '../../utils/api'
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
import ColumnList from '../../components/section/column/column-list'
import SectionArticles from '../../components/shared/section-articles'

/** @typedef {import('../../utils/api').postsInColumnSection} PostsInColumnSection */
/** @typedef {import('../../utils/api').ColumnSectionResponse} ColumnSectionResponse */

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
 * @param {Object} props.headerData
 * @param {string[]} props.filterPostIds
 * @param {number} props.gqlPostsCount
 * @returns {React.ReactElement}
 */
export default function Section({
  posts,
  section,
  headerData,
  filterPostIds,
  gqlPostsCount,
}) {
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

        {gqlPostsCount === posts.length ? (
          <ColumnList
            posts={posts}
            section={section}
            renderPageSize={RENDER_PAGE_SIZE}
            filterPostIds={filterPostIds}
            gqlPostsCount={gqlPostsCount}
          />
        ) : (
          <SectionArticles
            posts={posts}
            section={section}
            postsCount={posts.length}
            renderPageSize={RENDER_PAGE_SIZE}
          />
        )}

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
export async function getServerSideProps({ req, res }) {
  if (ENV === 'prod') {
    return {
      redirect: {
        destination: '/column/column',
        permanent: false,
      },
    }
  }

  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 600 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }
  const sectionSlug = 'column'

  const globalLogFields = getLogTraceObject(req)

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchColumnSectionPosts(),
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

  /** @type {[ number, Article[]]} */
  const postResult = handleAxiosResponse(
    responses[1],
    /** @param {import('axios').AxiosResponse<ColumnSectionResponse> | undefined} data */
    (data) => {
      const items = data?.data?.section?.items || []
      const counts = data?.data?.section?.counts || {
        posts: 0,
        externals: 0,
      }
      const formattedItems = items.map((item) => {
        // 處理 brief
        let briefText = ''
        if (item.type === 'story' && item.apiDataBrief) {
          if (
            Array.isArray(item.apiDataBrief) &&
            item.apiDataBrief.length > 0
          ) {
            const firstBlock = item.apiDataBrief[0]
            if (firstBlock.content && Array.isArray(firstBlock.content)) {
              briefText = firstBlock.content.join(' ')
            }
          }
        } else if (item.brief) {
          briefText = item.brief
        }

        let imageUrl = ''
        if (item.type === 'story') {
          if (item.heroImage) {
            imageUrl = item.heroImage
          } else if (item.og_image) {
            imageUrl = item.og_image
          }
        } else if (item.thumb) {
          imageUrl = item.thumb
        }

        return /** @type {Article} */ ({
          id: item.id || '',
          slug: item.slug || '',
          title: item.title || '',
          publishedDate: item.publishedDate || '',
          type: item.type,
          brief: { blocks: [{ text: briefText }] },
          categories: [],
          sections: [],
          heroImage: {
            resized: {
              original: imageUrl,
            },
            resizedWebp: {
              original: imageUrl,
            },
          },
        })
      })
      return [counts.posts + counts.externals || 0, formattedItems]
    },
    `Error occurs while getting json posts in section page (sectionSlug: ${sectionSlug})`,
    globalLogFields
  )
  const posts = postResult[1]

  const filterPostIds = posts
    .map((post) => {
      if (post.type === 'story') {
        return post.id
      }
      return null
    })
    .filter((id) => id)

  const gqlPostsResult = handleGqlResponse(
    await Promise.allSettled([
      fetchPostsBySectionSlug(
        sectionSlug,
        posts.length ? 0 : RENDER_PAGE_SIZE * 2,
        0,
        { id: { notIn: filterPostIds } }
      ),
    ]).then((results) => results[0]),
    dataHandler,
    `Error occurs while getting posts in section page (sectionSlug: ${sectionSlug})`,
    globalLogFields
  )
  const gqlPostsCount = gqlPostsResult[0] ?? 0
  posts.push(...gqlPostsResult[1])

  // fetchPost return empty array -> wrong authorId -> 404
  if (posts.length === 0) {
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
    posts,
    section,
    headerData: { sectionsData, topicsData },
    filterPostIds,
    gqlPostsCount,
  }

  return { props }
}
