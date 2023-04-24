import styled from 'styled-components'
import client from '../../apollo/apollo-client'

import InfiniteScrollList from '../infinite-scroll-list'
import Image from 'next/legacy/image'
import LoadingPage from '../../public/images/loading_page.gif'
import ArticleList from './article-list'
import { fetchPosts } from '../../apollo/query/posts'
import PremiumArticleList from './premium-article-list'

const Loading = styled.div`
  margin: 20px auto 0;
  padding: 0 0 20px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 64px auto 0;
    padding: 0 0 64px;
  }
`

/**
 * @typedef {import('../shared/article-list').Article} Article
 * @typedef {import('../../apollo/fragments/section').Section } Section
 */

/**
 *
 * @param {Object} props
 * @param {Number} props.postsCount
 * @param {Article[]} props.posts
 * @param {Section} props.section
 * @param {number} props.renderPageSize
 * @param {boolean} props.isPremium
 * @returns {React.ReactElement}
 */
export default function SectionArticles({
  postsCount,
  posts,
  section,
  renderPageSize,
  isPremium,
}) {
  async function fetchPostsFromPage(page) {
    try {
      const response = await client.query({
        query: fetchPosts,
        variables: {
          take: renderPageSize * 2,
          skip: (page - 1) * renderPageSize * 2,
          orderBy: { publishedDate: 'desc' },
          filter: {
            state: { equals: 'published' },
            sections: { some: { slug: { equals: section.slug } } },
          },
        },
      })
      return response.data.posts
    } catch (error) {
      console.error(error)
    }
    return
  }

  async function fetchPremiumPostsFromPage(page) {
    try {
      const response = await client.query({
        query: fetchPosts,
        variables: {
          take: renderPageSize * 2,
          skip: (page - 1) * renderPageSize * 2,
          orderBy: { publishedDate: 'desc' },
          filter: {
            state: { equals: 'published' },
            AND: [
              { sections: { some: { slug: { equals: section.slug } } } },
              { sections: { some: { slug: { equals: 'member' } } } },
            ],
          },
        },
      })
      return response.data.posts
    } catch (error) {
      console.error(error)
    }
    return
  }

  const loader = (
    <Loading key={0}>
      <Image src={LoadingPage} alt="loading page"></Image>
    </Loading>
  )

  return (
    <InfiniteScrollList
      initialList={posts}
      renderAmount={renderPageSize}
      fetchCount={Math.ceil(postsCount / renderPageSize)}
      fetchListInPage={
        isPremium ? fetchPremiumPostsFromPage : fetchPostsFromPage
      }
      loader={loader}
    >
      {(renderList) =>
        isPremium ? (
          <PremiumArticleList renderList={renderList} section={section} />
        ) : (
          <ArticleList renderList={renderList} section={section} />
        )
      }
    </InfiniteScrollList>
  )
}
