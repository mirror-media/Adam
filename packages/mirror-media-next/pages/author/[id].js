import errors from '@twreporter/errors'
import styled from 'styled-components'
import dynamic from 'next/dynamic'

import AuthorArticles from '../../components/author/author-articles'
import { GCP_PROJECT_ID, ENV } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
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
  const authorName = author.name || ''
  const shouldShowAd = useDisplayAd()
  return (
    <Layout
      head={{ title: `${authorName}相關報導` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <AuthorContainer>
        <GPT_Placeholder>
          {shouldShowAd && <StyledGPTAd pageKey="other" adKey="HD" />}
        </GPT_Placeholder>
        {authorName && <AuthorTitle>{authorName}</AuthorTitle>}
        <AuthorArticles
          postsCount={postsCount}
          posts={posts}
          authorId={author.id}
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
    fetchPostsByAuthorId(authorId, RENDER_PAGE_SIZE * 2, mockError ? NaN : 0),
    fetchAuthorByAuthorId(authorId),
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
        'Error occurs while getting author page data'
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
        throw new Error('fetch author posts failed')
      }
      return
    }
  })

  //handle header data
  const headerData =
    handledResponses[0] && 'sectionsData' in handledResponses[0]
      ? handledResponses[0]
      : { sectionsData: [], topicsData: [] }
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
        message: `fetch post of authroId ${authorId} return empty posts, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }
  /** @type {number} postsCount */
  const postsCount = handledResponses[1]?.postsCount || 0
  /** @type {Article[]} */
  const posts = handledResponses[1]?.posts || []

  // handle fetch author data
  /** @type {Author} */
  const author = handledResponses[2]?.contact || { id: authorId }

  const props = {
    postsCount,
    posts,
    author,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
