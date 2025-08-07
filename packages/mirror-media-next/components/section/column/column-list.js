import styled from 'styled-components'
import Image from 'next/legacy/image'

import InfiniteScrollList from '../../infinite-scroll-list'
import ArticleList from '../../shared/article-list'
import { fetchPostsBySectionSlug } from '../../../utils/api/section'
import LoadingPage from '../../../public/images-next/loading_page.gif'

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
 * @typedef {import('../../shared/article-list').Article} Article
 * @typedef {import('../../../apollo/fragments/section').Section } Section
 */

/**
 *
 * @param {Object} props
 * @param {Article[]} props.posts
 * @param {Section} props.section
 * @param {number} props.renderPageSize
 * @param {string[]} [props.filterPostIds]
 * @param {number} props.gqlPostsCount
 * @returns {React.ReactElement}
 */
export default function ColumnList({
  posts,
  section,
  renderPageSize,
  filterPostIds = [],
  gqlPostsCount = 0,
}) {
  const fetchPageSize = renderPageSize * 2

  async function fetchPostsFromPage(page) {
    if (!section?.slug) {
      return
    }
    try {
      const take = fetchPageSize
      const skip = (page - 2) * take
      const response = await fetchPostsBySectionSlug(
        section.slug,
        take,
        skip,
        filterPostIds.length > 0 ? { id: { notIn: filterPostIds } } : {}
      )
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
      fetchCount={Math.ceil(gqlPostsCount / fetchPageSize) + 1}
      fetchListInPage={fetchPostsFromPage}
      loader={loader}
    >
      {(renderList) => (
        <ArticleList renderList={renderList} section={section} />
      )}
    </InfiniteScrollList>
  )
}
