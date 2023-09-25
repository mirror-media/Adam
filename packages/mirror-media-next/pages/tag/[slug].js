import errors from '@twreporter/errors'
import styled from 'styled-components'
import dynamic from 'next/dynamic'

import TagArticles from '../../components/tag/tag-articles'
import { GCP_PROJECT_ID, ENV } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
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
  const tagName = tag.name || ''
  const shouldShowAd = useDisplayAd()

  return (
    <Layout
      head={{ title: `${tagName}相關報導` }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <TagContainer>
        <GPT_Placeholder>
          {shouldShowAd && <StyledGPTAd pageKey="other" adKey="HD" />}
        </GPT_Placeholder>

        {tagName && (
          <TagTitleWrapper>
            <TagTitle>{tagName}</TagTitle>
          </TagTitleWrapper>
        )}

        <TagArticles
          postsCount={postsCount}
          posts={posts}
          tagSlug={tag.slug}
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
    fetchPostsByTagSlug(tagSlug, RENDER_PAGE_SIZE * 2, mockError ? NaN : 0),
    fetchTagByTagSlug(tagSlug),
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
      if (index === 1) {
        // fetch key data (posts) failed, redirect to 500
        throw new Error('fetch tag posts failed')
      }
      return
    }
  })

  // handle header data
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
        message: `fetch post of tagSlug ${tagSlug} return empty posts, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }
  /** @type {number} postsCount */
  const postsCount = handledResponses[1]?.postsCount || 0
  /** @type {Article[]} */
  const posts = handledResponses[1]?.posts || []

  // handle fetch tag data
  /** @type {Tag} */
  const tag = handledResponses[2]?.tag || { slug: tagSlug }

  const props = {
    postsCount,
    posts,
    tag,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
