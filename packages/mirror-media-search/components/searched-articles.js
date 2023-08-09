import styled from 'styled-components'
import axios from 'axios'

import InfiniteScrollList from './infinite-scroll-list'
import Image from 'next/legacy/image'
import LoadingPage from '../public/images/loading_page.gif'
import ArticleList from './article-list'
import { API_TIMEOUT } from '../config'

const Loading = styled.div`
  margin: 20px auto 0;
  padding: 0 0 20px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 64px auto 0;
    padding: 0 0 64px;
  }
`

export default function SearchedArticles({ searchResult }) {
  const { items: initialArticles, queries } = searchResult
  const searchTerms = queries.request[0].exactTerms
  async function fetchPostsFromPage(page) {
    try {
      const { data } = await axios({
        method: 'get',
        url: '/api/search',
        params: {
          exactTerms: searchTerms,
          start: (page - 1) * 10 + 1,
        },
        timeout: API_TIMEOUT,
      })

      return data.items
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
      initialList={initialArticles}
      renderAmount={initialArticles.length}
      fetchCount={10}
      fetchListInPage={fetchPostsFromPage}
      loader={loader}
    >
      {(renderList) => <ArticleList renderList={renderList} />}
    </InfiniteScrollList>
  )
}
