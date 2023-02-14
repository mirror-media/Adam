import errors from '@twreporter/errors'
import styled from 'styled-components'

import client from '../../apollo/apollo-client'
import { fetchPosts } from '../../apollo/query/posts'
import { fetchTag } from '../../apollo/query/tags'
import TagArticles from '../../components/tag-articles'
import { GCP_PROJECT_ID } from '../../config'

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

const RENDER_PAGE_SIZE = 12

/**
 * @param {Object} props
 * @param {import('../../type/shared/article').Article[]} props.posts
 * @param {import('../../type/tag').Tag} props.tag
 * @param {Number} props.postsCount
 * @returns {React.ReactElement}
 */
export default function Tag({ postsCount, posts, tag }) {
  return (
    <TagContainer>
      <TagTitleWrapper>
        <TagTitle>{tag?.name}</TagTitle>
      </TagTitleWrapper>
      <TagArticles
        postsCount={postsCount}
        posts={posts}
        tag={tag}
        renderPageSize={RENDER_PAGE_SIZE}
      />
    </TagContainer>
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
      return response.value.data
    } else if (response.status === 'rejected') {
      const { graphQLErrors, clientErrors, networkError } = response.reason
      const annotatingError = errors.helpers.wrap(
        response.reason,
        'UnhandledError',
        'Error occurs while getting index page data'
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

  /** @type {Number} postsCount */
  const postsCount = handledResponses[0]?.postsCount || 0
  /** @type {import('../../type/shared/article').Article[]} */
  const posts = handledResponses[0]?.posts || []
  /** @type {import('../../type/tag').Tag} */
  const tag = handledResponses[1]?.tag || {}

  const props = {
    postsCount,
    posts,
    tag,
  }

  return { props }
}
