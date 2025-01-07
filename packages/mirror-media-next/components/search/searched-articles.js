import styled from 'styled-components'

import Image from 'next/legacy/image'
import LoadingPage from '../../public/images-next/loading_page.gif'
import ArticleList from './article-list'
// import gtag from '../utils/programmable-search/gtag'

import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'
import { SEARCH_PER_PAGE } from '../../constants/search'
import { useState } from 'react'
import { SECOND } from '../../constants/time-unit'

const Loading = styled.div`
  margin: 20px auto 0;
  padding: 0 0 20px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 64px auto 0;
    padding: 0 0 64px;
  }
`

const ListEnd = styled.h5`
  color: #054f77;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  margin: 28px 0;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
    line-height: 200%;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 36px 0;
  }
`

/**
 * @param {Object} props
 * @param {import('../../pages/search/[searchTerms]').SearchResult} props.searchResult
 */
export default function SearchedArticles({ searchResult }) {
  const { items } = searchResult
  const [isEnd, setIsEnd] = useState(SEARCH_PER_PAGE >= items.length)
  const initialArticles = items?.slice(0, SEARCH_PER_PAGE) || []

  async function fetchPostsFromPage(page) {
    // gtag.sendGAEvent(`search-${searchTerms}-loadmore-${page}`)

    await new Promise((resolve) => setTimeout(resolve, SECOND))

    if (SEARCH_PER_PAGE * page >= items.length) {
      setIsEnd(true)
    }

    return items.slice(SEARCH_PER_PAGE * (page - 1), SEARCH_PER_PAGE * page)
  }

  const loader = (
    <Loading key={0}>
      <Image src={LoadingPage} alt="loading page"></Image>
    </Loading>
  )

  return (
    <>
      <InfiniteScrollList
        initialList={initialArticles}
        pageSize={SEARCH_PER_PAGE}
        fetchListInPage={fetchPostsFromPage}
        isAutoFetch={true}
        loader={loader}
      >
        {(renderList) => {
          return <ArticleList renderList={renderList} />
        }}
      </InfiniteScrollList>
      {isEnd && <ListEnd>已顯示完近期相關新聞</ListEnd>}
    </>
  )
}
