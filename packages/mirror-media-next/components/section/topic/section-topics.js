import styled from 'styled-components'

import InfiniteScrollList from '../../infinite-scroll-list'
import Image from 'next/legacy/image'
import LoadingPage from '../../../public/images/loading_page.gif'
import TopicList from './topic-list'
import { fetchTopicList } from '../../../utils/api/section-topic'

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
 * @typedef {import('./topic-list').Topic} Topic
 */

/**
 *
 * @param {Object} props
 * @param {number} props.topicsCount
 * @param {Topic[]} props.topics
 * @param {number} props.renderPageSize
 * @returns {React.ReactElement}
 */
export default function SectionTopics({ topics, topicsCount, renderPageSize }) {
  const fetchPageSize = renderPageSize * 2
  async function fetchTopicsFromPage(page) {
    try {
      const take = fetchPageSize
      const skip = (page - 1) * take
      const response = await fetchTopicList(take, skip)
      return response.data.topics
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
      initialList={topics}
      renderAmount={renderPageSize}
      fetchCount={Math.ceil(topicsCount / fetchPageSize)}
      fetchListInPage={fetchTopicsFromPage}
      loader={loader}
    >
      {(renderList) => <TopicList renderList={renderList} />}
    </InfiniteScrollList>
  )
}
