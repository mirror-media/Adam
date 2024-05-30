import styled from 'styled-components'
import dynamic from 'next/dynamic'

import AuthorArticles from '../../components/author/author-articles'
import { ENV } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import {
  getSectionAndTopicFromDefaultHeaderData,
  getPostsAndPostscountFromGqlData,
} from '../../utils/data-process'
import { setPageCache } from '../../utils/cache-setting'

import Layout from '../../components/shared/layout'
import { Z_INDEX } from '../../constants/index'
import {
  fetchAuthorByAuthorId,
  fetchPostsByAuthorId,
} from '../../utils/api/author'
import { useDisplayAd } from '../../hooks/useDisplayAd'
const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})
import FullScreenAds from '../../components/ads/full-screen-ads'
import GPTMbStAd from '../../components/ads/gpt/gpt-mb-st-ad'
import GPT_Placeholder from '../../components/ads/gpt/gpt-placeholder'
import { useCallback, useState } from 'react'
import { getLogTraceObject } from '../../utils'
import {
  handleAxiosResponse,
  handleGqlResponse,
} from '../../utils/response-handle'

const AuthorContainer = styled.main`
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

const AuthorTitle = styled.h1`
  display: inline-block;
  margin: 16px 0 16px 16px;
  padding: 4px 16px;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 500;
  color: black;
  ${({ theme }) => theme.breakpoint.md} {
    margin: 18px 0 20px;
    font-size: 28px;
    font-weight: 600;
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
 * @typedef {import('../../components/author/author-articles').Article} Article
 * @typedef {import('../../components/author/author-articles').Author} Author
 */

/**
 * @param {Object} props
 * @param {Article[]} props.posts
 * @param {Author} props.author
 * @param {number} props.postsCount
 * @param {Object} props.headerData
 * @returns {React.ReactElement}
 */
export default function Author({ postsCount, posts, author, headerData }) {
  const authorName = author?.name || ''
  const { shouldShowAd, isLogInProcessFinished } = useDisplayAd()
  const [isHDAdEmpty, setISHDAdEmpty] = useState(true)

  const handleObSlotRenderEnded = useCallback((e) => {
    setISHDAdEmpty(e.isEmpty)
  }, [])
  return (
    <Layout
      head={{ title: `${authorName}相關報導` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <AuthorContainer>
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

        {authorName && <AuthorTitle>{authorName}</AuthorTitle>}
        <AuthorArticles
          postsCount={postsCount}
          posts={posts}
          authorId={author?.id}
          renderPageSize={RENDER_PAGE_SIZE}
        />

        {shouldShowAd && <StickyGPTAd pageKey="other" />}
        {shouldShowAd && <FullScreenAds />}
      </AuthorContainer>
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

  const authorId = Array.isArray(query.id) ? query.id[0] : query.id

  //When `authorId` is not only numeric, redirect to the '/'.
  if (!/^\d+$/.test(authorId)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const globalLogFields = getLogTraceObject(req)

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchAuthorByAuthorId(authorId),
    fetchPostsByAuthorId(authorId, RENDER_PAGE_SIZE * 2, 0),
  ])

  //handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    `Error occurs while getting header data in author page (authorId: ${authorId})`,
    globalLogFields
  )

  // handle author data
  const authorData = handleGqlResponse(
    responses[1],
    (gqlData) => {
      return gqlData?.data
    },
    `Error occurs while getting author data in author page (authorId: ${authorId})`,
    globalLogFields
  )

  if (!authorData) {
    throw new Error('fetch author failed')
  }

  /** @type {Author} */
  const author = authorData.contact
  if (!author) {
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `The author which id is '${authorId}' does not exist, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }

  // handle author related post data
  /**
   * @template {import('../../apollo/fragments/post').ListingPost} T
   * @type {typeof getPostsAndPostscountFromGqlData<T>}
   */
  const dataHandler = getPostsAndPostscountFromGqlData

  /** @type {[number, Article[]]} */
  const [postsCount, posts] = handleGqlResponse(
    responses[2],
    dataHandler,
    `Error occurs while getting post data in author page (authorId: ${authorId})`,
    globalLogFields
  )

  const props = {
    postsCount,
    posts,
    author,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
