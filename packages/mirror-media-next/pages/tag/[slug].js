import errors from '@twreporter/errors'
import styled from 'styled-components'

import client from '../../apollo/apollo-client'
import { fetchPosts } from '../../apollo/query/posts'
import { fetchTag } from '../../apollo/query/tags'
import TagArticles from '../../components/tag/tag-articles'
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import Layout from '../../components/shared/layout'
import GPTAd from '../../components/ads/gpt/gpt-ad'
import { Z_INDEX } from '../../constants/index'

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
  return (
    <Layout
      head={{ title: `${tag?.name}相關報導` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <TagContainer>
        <StyledGPTAd pageKey="other" adKey="HD" />
        <TagTitleWrapper>
          <TagTitle>{tag?.name}</TagTitle>
        </TagTitleWrapper>
        <TagArticles
          postsCount={postsCount}
          posts={posts}
          tag={tag}
          renderPageSize={RENDER_PAGE_SIZE}
        />
        <StyledGPTAd pageKey="other" adKey="FT" />
        <StickyGPTAd pageKey="other" adKey="ST" />
      </TagContainer>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ query, req }) {
  const tagSlug = query.slug
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
          tags: { some: { slug: { equals: tagSlug } } },
        },
      },
    }),
    client.query({
      query: fetchTag,
      variables: {
        where: { slug: tagSlug },
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
        'Error occurs while getting tag page data'
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
      : { sectionsData: [], topicsData: [] }
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
  /** @type {Tag} */
  const tag =
    'data' in handledResponses[2] ? handledResponses[2]?.data?.tag || {} : {}

  const props = {
    postsCount,
    posts,
    tag,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
