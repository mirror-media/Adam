import styled from 'styled-components'

import InfiniteScrollList from '../../infinite-scroll-list'
import Image from 'next/legacy/image'
// @ts-ignore
import LoadingPage from '../../../public/images/loading_page.gif'
import ListArticles from './list-articles'
import { fetchTopicByTopicSlug } from '../../../utils/api/topic'

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
 * @typedef {import('./list-articles').Article} Article
 */

/**
 *
 * @param {Object} props
 * @param {number} props.postsCount
 * @param {Article[]} props.posts
 * @param {string} props.topicId
 * @param {number} props.renderPageSize
 * @param {string} props.dfp
 * @returns {React.ReactElement}
 */
export default function TopicListArticles({
  postsCount,
  posts,
  topicId,
  renderPageSize,
  dfp,
}) {
  const fetchPageSize = renderPageSize
  async function fetchTopicPostsFromPage(page) {
    if (!topicId) {
      return
    }
    try {
      const take = fetchPageSize
      const skip = (page - 1) * take
      const response = await fetchTopicByTopicSlug(topicId, take, skip)
      return response.data.topic.posts
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
      fetchListInPage={fetchTopicPostsFromPage}
      loader={loader}
    >
      {(renderList) => <ListArticles renderList={renderList} dfp={dfp} />}
    </InfiniteScrollList>
  )
}
