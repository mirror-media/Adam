import styled from 'styled-components'
import Image from 'next/legacy/image'

import InfiniteScrollList from '../infinite-scroll-list'
import ArticleList from '../shared/article-list'
import { fetchPostsByTagSlug } from '../../utils/api/tag'
import LoadingPage from '../../public/images-next/loading_page.gif'

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
 * @typedef {import('../../apollo/fragments/tag').Tag} Tag
 */

/**
 *
 * @param {Object} props
 * @param {number} props.postsCount
 * @param {Article[]} props.posts
 * @param {Tag["slug"]} props.tagSlug
 * @param {number} props.renderPageSize
 * @returns {React.ReactElement}
 */
export default function TagArticles({
  postsCount,
  posts,
  tagSlug,
  renderPageSize,
}) {
  const fetchPageSize = renderPageSize * 2

  async function fetchPostsFromPage(page) {
    if (!tagSlug) {
      return
    }
    try {
      const take = fetchPageSize
      const skip = (page - 1) * take
      const response = await fetchPostsByTagSlug(tagSlug, take, skip)
      return response.data.posts
    } catch (error) {
      // [to-do]: use beacon api to log error on gcs
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
      fetchCount={Math.ceil(postsCount / fetchPageSize)}
      fetchListInPage={fetchPostsFromPage}
      loader={loader}
    >
      {(renderList) => <ArticleList renderList={renderList} />}
    </InfiniteScrollList>
  )
}
