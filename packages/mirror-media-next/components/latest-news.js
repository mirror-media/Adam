import React, { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroller'
import LoadingPage from '../public/images/loading_page.gif'
import LatestNewsItem from './latest-news-item'
import { transformRawDataToArticleInfo } from '../utils'
import { URL_STATIC_POST_EXTERNAL } from '../config'
import Image from 'next/image'
const Wrapper = styled.section`
  width: 100%;
  margin: 20px auto 40px;
  max-width: 320px;
  text-align: center;

  h2 {
    color: ${({ theme }) => theme.color.brandColor.darkBlue};
    font-size: 20px;
    line-height: 1.4;
    font-weight: 500;
    margin: 12px auto;
    ${({ theme }) => theme.breakpoint.md} {
      margin: 24px auto;
      font-weight: 700;
    }
    ${({ theme }) => theme.breakpoint.xl} {
      margin: 20px auto;
      text-align: left;
      font-size: 28px;
      line-height: 1.15;
    }
  }

  ${({ theme }) => theme.breakpoint.md} {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
  }
`
const ItemContainer = styled.div`
  ${({ theme }) => theme.breakpoint.md} {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fill, 244px);
    justify-content: center;
  }
`

const Test = styled.div`
  border: 1px solid black;
  background-color: #f7ecdf;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999999;
`
const Loading = styled.div`
  margin: 20px auto 0;
  padding: 0 0 20px;
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 64px auto 0;
    padding: 0 0 64px;
  }
`
/** the amount of articles every time we load more */
const RENDER_PAGE_SIZE = 20

/**
 * @typedef {import('../type/raw-data.typedef').RawData} RawData
 */
/**
 * @typedef {import('../type/index').ArticleInfoCard} ArticleInfoCard
 */

/**
 * @param {Object} props
 * @param {RawData[]} [props.latestNewsData = []]
 * @param {String} [props.latestNewsTimestamp = '']
 * @returns {React.ReactElement}
 */
export default function LatestNews(props) {
  const [fetchCount, setFetchCount] = useState(0)
  const [loadMoreCount, setLoadMoreCount] = useState(0)
  const [hasFetchFirstJson, setHasFetchFirstJson] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const shouldUpdateLatestArticle = useMemo(() => {
    const formattedTimeStamp = props.latestNewsTimestamp.replace(/ /g, 'T')
    const articlesUpdateTimestamp = new Date(formattedTimeStamp).getTime()
    const currentTimestamp = new Date().getTime()
    return currentTimestamp - articlesUpdateTimestamp > 1000 * 180
  }, [props.latestNewsTimestamp])

  const latestNewsData = props.latestNewsData

  const [obtainedLatestNews, setObtainedLatestNews] = useState([
    ...transformRawDataToArticleInfo(latestNewsData),
  ])
  const [renderedLatestNews, setRenderedLatestNews] = useState(
    obtainedLatestNews.slice(0, RENDER_PAGE_SIZE)
  )
  const obtainedLatestNewsAmount = useMemo(() => {
    return obtainedLatestNews.length
  }, [obtainedLatestNews])
  const renderedLatestNewsAmount = useMemo(() => {
    return renderedLatestNews.length
  }, [renderedLatestNews])

  /**
   * @param {Number} [serialNumber = 1]
   * @returns {Promise<RawData[]>}
   */
  async function fetchCertainLatestNews(serialNumber = 1) {
    try {
      const { data } = await axios({
        method: 'get',
        url: `${URL_STATIC_POST_EXTERNAL}0${serialNumber}.json`,
        timeout: 5000, //since size of json file is large, we assign timeout as 5000ms to prevent content lost in poor network condition
      })
      /** @type {import('../type/raw-data.typedef').RawData[]} */
      return data.latest
    } catch (e) {
      console.error(e)
      return []
    }
  }
  async function fetchMoreLatestNews() {
    if (fetchCount === 4) {
      return
    }
    const latestNewsData = await fetchCertainLatestNews(fetchCount + 1)
    /** @type {ArticleInfoCard[]} */
    const latestNews = transformRawDataToArticleInfo(latestNewsData)
    setObtainedLatestNews((oldArray) => [...oldArray, ...latestNews])
    setFetchCount((preState) => preState + 1)
  }
  function showMoreLatestNews() {
    setRenderedLatestNews((oldArray) => [
      ...oldArray,
      ...obtainedLatestNews.slice(
        renderedLatestNewsAmount,
        renderedLatestNewsAmount + RENDER_PAGE_SIZE
      ),
    ])
  }
  function handleLoadMore() {
    if (isLoading) {
      return
    }
    if (
      obtainedLatestNewsAmount === renderedLatestNewsAmount &&
      fetchCount === 4
    ) {
      return
    } else if (
      obtainedLatestNewsAmount - renderedLatestNewsAmount <=
      RENDER_PAGE_SIZE
    ) {
      setIsLoading(true)
      fetchMoreLatestNews().then(() => setIsLoading(false))
    }
    showMoreLatestNews()
    setLoadMoreCount((pre) => pre + 1)
  }
  useEffect(() => {
    async function fetchFirstJsonOnClientSide() {
      const latestNewsData = await fetchCertainLatestNews(1)
      /** @type {ArticleInfoCard[]} */
      const latestNews = transformRawDataToArticleInfo(latestNewsData)
      setObtainedLatestNews([...latestNews])
      setRenderedLatestNews([...latestNews].slice(0, RENDER_PAGE_SIZE))
    }
    if (shouldUpdateLatestArticle && !hasFetchFirstJson) {
      fetchFirstJsonOnClientSide()
    }
    setFetchCount(1)
    setHasFetchFirstJson(true)
  }, [shouldUpdateLatestArticle, hasFetchFirstJson])
  return (
    <Wrapper>
      {/* Temporary components for developing */}
      <Test>
        <p>文章timestamp:{props.latestNewsTimestamp}</p>
        <p>
          {shouldUpdateLatestArticle ? '需要' : '不需要'}重新於client side 取得
          post_external01.json資料
        </p>
        <p>已fetch json檔{fetchCount}次</p>
        <p>已load more {loadMoreCount}次</p>
        <p>已抓取文章：{obtainedLatestNewsAmount}</p>
        <p>已顯示文章：{renderedLatestNewsAmount}</p>
      </Test>

      <h2>最新文章</h2>

      <InfiniteScroll
        pageStart={20}
        loadMore={handleLoadMore}
        hasMore={
          !(
            obtainedLatestNewsAmount === renderedLatestNewsAmount &&
            fetchCount === 4
          )
        }
        threshold={150}
        loader={
          <Loading key={0}>
            <Image src={LoadingPage} alt="loading page"></Image>
          </Loading>
        }
      >
        <ItemContainer>
          {renderedLatestNews.map((item) => (
            <LatestNewsItem key={item.slug} itemData={item}></LatestNewsItem>
          ))}
        </ItemContainer>
      </InfiniteScroll>
    </Wrapper>
  )
}
