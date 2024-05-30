import styled from 'styled-components'
import dynamic from 'next/dynamic'

import TagArticles from '../../components/tag/tag-articles'
import { ENV } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import {
  getSectionAndTopicFromDefaultHeaderData,
  getPostsAndPostscountFromGqlData,
} from '../../utils/data-process'
import Layout from '../../components/shared/layout'
import { Z_INDEX } from '../../constants/index'
import { fetchPostsByTagSlug, fetchTagByTagSlug } from '../../utils/api/tag'
import { useDisplayAd } from '../../hooks/useDisplayAd'
import { setPageCache } from '../../utils/cache-setting'
import FullScreenAds from '../../components/ads/full-screen-ads'
const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})
import GPTMbStAd from '../../components/ads/gpt/gpt-mb-st-ad'
import GPT_Placeholder from '../../components/ads/gpt/gpt-placeholder'
import { useCallback, useState } from 'react'
import { getLogTraceObject } from '../../utils'
import {
  handleAxiosResponse,
  handleGqlResponse,
} from '../../utils/response-handle'

const TagContainer = styled.main`
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

const TagTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoint.md} {
    &::after {
      content: '';
      margin: 0px 0px 0px 28px;
      display: inline-block;
      flex: 1 1 auto;
      height: 2px;
      background: linear-gradient(90deg, rgb(0, 0, 0) 30%, rgb(255, 255, 255));
    }
  }
`

const TagTitle = styled.h1`
  display: inline-block;
  margin: 16px 0 16px 16px;
  padding: 4px 16px;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 600;
  color: white;
  background-color: black;
  border-radius: 6px;
  ${({ theme }) => theme.breakpoint.md} {
    margin: 20px 0 24px;
    padding: 4px 8px;
    font-size: 28px;
    font-weight: 500;
    line-height: 1.4;
    border-radius: 10px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 24px 0 28px;
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
 * @typedef {import('../../components/tag/tag-articles').Article} Article
 * @typedef {import('../../components/tag/tag-articles').Tag} Tag
 */

/**
 * @param {Object} props
 * @param {Article[]} props.posts
 * @param {Tag} props.tag
 * @param {Number} props.postsCount
 * @param {Object} props.headerData
 * @returns {React.ReactElement}
 */
export default function Tag({ postsCount, posts, tag, headerData }) {
  const tagName = tag?.name || ''
  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()
  const [isHDAdEmpty, setISHDAdEmpty] = useState(true)
  const handleObSlotRenderEnded = useCallback((e) => {
    setISHDAdEmpty(e.isEmpty)
  }, [])

  return (
    <Layout
      head={{ title: `${tagName}相關報導` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <TagContainer>
        <GPT_Placeholder
          shouldShowAd={shouldShowAd}
          isHDAdEmpty={isHDAdEmpty}
          isLogInProcessFinished={isLogInProcessFinished}
        >
          {shouldShowAd && (
            <StyledGPTAd
              pageKey="other"
              adKey="HD"
              onSlotRenderEnded={handleObSlotRenderEnded}
            />
          )}
        </GPT_Placeholder>

        {tagName && (
          <TagTitleWrapper>
            <TagTitle>{tagName}</TagTitle>
          </TagTitleWrapper>
        )}

        <TagArticles
          postsCount={postsCount}
          posts={posts}
          tagSlug={tag?.slug}
          renderPageSize={RENDER_PAGE_SIZE}
        />

        {shouldShowAd && <StickyGPTAd pageKey="other" />}
        {shouldShowAd && <FullScreenAds />}
      </TagContainer>
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
  const tagSlug = Array.isArray(query.slug) ? query.slug[0] : query.slug

  const globalLogFields = getLogTraceObject(req)

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchTagByTagSlug(tagSlug),
    fetchPostsByTagSlug(tagSlug, RENDER_PAGE_SIZE * 2, 0),
  ])

  // handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    `Error occurs while getting header data in tag page (tagSlug: ${tagSlug})`,
    globalLogFields
  )

  // handle fetch tag data
  /** @type {Tag | undefined} */
  const tag = handleGqlResponse(
    responses[1],
    (gqlData) => {
      return gqlData?.data?.tag
    },
    `Error occurs while getting tag data in tag page (tagSlug: ${tagSlug})`,
    globalLogFields
  )

  if (!tag) {
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `The tag which slug is '${tagSlug}' does not exist, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }

  // handle fetch post data
  const [postsCount, posts] = handleGqlResponse(
    responses[2],
    getPostsAndPostscountFromGqlData,
    `Error occurs while getting post data in tag page (tagSlug: ${tagSlug})`,
    globalLogFields
  )

  const props = {
    postsCount,
    posts,
    tag,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
