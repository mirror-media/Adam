import styled from 'styled-components'
import client from '../apollo/apollo-client'

import InfiniteScrollList from './InifiniteScrollList'
import Image from 'next/legacy/image'
import LoadingPage from '../public/images/loading_page.gif'
import ArticleListItems from './article-list-items'
import { fetchPosts } from '../apollo/query/posts'

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
 *
 * @param {Object} props
 * @param {Number} props.postsCount
 * @param {import('../type/shared/article').Article[]} props.posts
 * @param {import('../type/section').Section} props.section
 * @param {Number} props.renderPageSize
 * @returns {React.ReactElement}
 */
export default function SectionArticles({
  postsCount,
  posts,
  section,
  renderPageSize,
}) {
  async function fetchPostsFromPage(page) {
    try {
      const response = await client.query({
        query: fetchPosts,
        variables: {
          take: renderPageSize * 2,
          skip: page * renderPageSize * 2,
          orderBy: { publishedDate: 'desc' },
          filter: {
            state: { equals: 'published' },
            sections: { some: { slug: { equals: section.slug } } },
          },
        },
      })
      return response.data.posts
    } catch (error) {}
    return
  }

  const loader = (
    <Loading key={0}>
      <Image src={LoadingPage} alt="loading page"></Image>
    </Loading>
  )

  return (
    <InfiniteScrollList
      propsIS={{
        threshold: 150,
        loader,
      }}
      initialList={posts}
      renderPageSize={renderPageSize}
      pageCount={Math.ceil(postsCount / renderPageSize)}
      fetchListInPage={fetchPostsFromPage}
    >
      {(renderList) => (
        <ArticleListItems renderList={renderList} section={section} />
      )}
    </InfiniteScrollList>
  )
}
