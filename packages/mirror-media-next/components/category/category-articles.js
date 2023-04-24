import styled from 'styled-components'
import client from '../../apollo/apollo-client'

import InfiniteScrollList from '../infinite-scroll-list'
import Image from 'next/legacy/image'
import LoadingPage from '../../public/images/loading_page.gif'
import ArticleList from '../shared/article-list'
import { fetchPosts } from '../../apollo/query/posts'
import PremiumArticleList from '../shared/premium-article-list'
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
 * @typedef {import('../shared/article-list').Section} Section
 * @typedef {import('../../apollo/fragments/category').Category} Category
 */

/**
 *
 * @param {Object} props
 * @param {Number} props.postsCount
 * @param {Article[]} props.posts
 * @param {Category} props.category
 * @param {Number} props.renderPageSize
 * @param {boolean} props.isPremium
 * @returns {React.ReactElement}
 */
export default function CategoryArticles({
  postsCount,
  posts,
  category,
  renderPageSize,
  isPremium,
}) {
  const fetchPageSize = renderPageSize * 2
  async function fetchPostsFromPage(page) {
    try {
      const response = await client.query({
        query: fetchPosts,
        variables: {
          take: fetchPageSize,
          skip: (page - 1) * fetchPageSize,
          orderBy: { publishedDate: 'desc' },
          filter: {
            state: { equals: 'published' },
            categories: { some: { slug: { equals: category.slug } } },
          },
        },
      })
      return response.data.posts
    } catch (error) {
      console.error(error)
    }
    return []
  }

  const loader = (
    <Loading key={0}>
      <Image src={LoadingPage} alt="loading page"></Image>
    </Loading>
  )

  return (
    <>
      <InfiniteScrollList
        initialList={posts}
        renderAmount={renderPageSize}
        fetchCount={Math.ceil(postsCount / fetchPageSize)}
        fetchListInPage={fetchPostsFromPage}
        loader={loader}
      >
        {(renderList) =>
          isPremium ? (
            <PremiumArticleList renderList={renderList} />
          ) : (
            <ArticleList renderList={renderList} />
          )
        }
      </InfiniteScrollList>
    </>
  )
}
