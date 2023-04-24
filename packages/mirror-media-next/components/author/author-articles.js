import styled from 'styled-components'
import client from '../../apollo/apollo-client'

import InfiniteScrollList from '../infinite-scroll-list'
import Image from 'next/legacy/image'
import LoadingPage from '../../public/images/loading_page.gif'
import ArticleList from '../shared/article-list'
import { fetchPosts } from '../../apollo/query/posts'

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
 * @typedef {import('../../apollo/fragments/contact').Contact} Author
 */

/**
 *
 * @param {Object} props
 * @param {number} props.postsCount
 * @param {Article[]} props.posts
 * @param {Author} props.author
 * @param {number} props.renderPageSize
 * @returns {React.ReactElement}
 */
export default function AuthorArticles({
  postsCount,
  posts,
  author,
  renderPageSize,
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
            OR: [
              { writers: { some: { id: { equals: author.id } } } },
              { photographers: { some: { id: { equals: author.id } } } },
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
      fetchListInPage={fetchPostsFromPage}
      loader={loader}
    >
      {(renderList) => <ArticleList renderList={renderList} />}
    </InfiniteScrollList>
  )
}
