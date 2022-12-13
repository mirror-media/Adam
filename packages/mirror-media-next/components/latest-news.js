import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import LatestNewsItem from './latest-news-item'
import { transformRawDataToArticleInfo } from '../utils'
import { URL_STATIC_POST_EXTERNAL, API_TIMEOUT } from '../config'

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
const LoadMoreButton = styled.button`
  margin: 10px auto;
  padding: 10px 0;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.brandColor.darkBlue};
  color: ${({ theme }) => theme.color.brandColor.darkBlue};
`

const Test = styled.div`
  border: 1px solid black;
  background-color: #f7ecdf;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999999;
`

/**
 * @param {Object} props
 * @param {import('../type/raw-data.typedef').RawData[]} [props.latestNewsData=[]]
 * @returns {React.ReactElement}
 */
export default function LatestNews(props) {
  const [fetchCount, setFetchCount] = useState(1)

  const latestNewsData = [...props.latestNewsData]

  const [obtainedLatestNews, setObtainedLatestNews] = useState([
    ...transformRawDataToArticleInfo(latestNewsData),
  ])
  const [renderedLatestNews, setRenderedLatestNews] = useState(
    obtainedLatestNews.slice(0, 20)
  )
  const obtainedLatestNewsAmount = useMemo(() => {
    return obtainedLatestNews.length
  }, [obtainedLatestNews])
  const renderedLatestNewsAmount = useMemo(() => {
    return renderedLatestNews.length
  }, [renderedLatestNews])
  async function fetchMoreLatestNews() {
    if (fetchCount === 4) {
      return
    }
    const { data } = await axios({
      method: 'get',
      url: `${URL_STATIC_POST_EXTERNAL}0${fetchCount + 1}.json`,
      timeout: API_TIMEOUT,
    })
    /** @type {import('../type/raw-data.typedef').RawData[]} */
    const latestNewsData = [...data.latest]
    const latestNews = transformRawDataToArticleInfo(latestNewsData)
    setObtainedLatestNews((oldArray) => [...oldArray, ...latestNews])
    setFetchCount((preState) => preState + 1)
  }
  function showMoreLatestNews() {
    setRenderedLatestNews((oldArray) => [
      ...oldArray,
      ...obtainedLatestNews.slice(
        renderedLatestNewsAmount,
        renderedLatestNewsAmount + 20
      ),
    ])
  }
  return (
    <Wrapper>
      <Test>
        <p>已抓取文章：{obtainedLatestNewsAmount}</p>
        <p>已顯示文章：{renderedLatestNewsAmount}</p>
      </Test>
      <h2>最新文章</h2>
      <ItemContainer>
        {renderedLatestNews.map((item) => (
          <LatestNewsItem key={item.slug} itemData={item}></LatestNewsItem>
        ))}
      </ItemContainer>
      {/* Temporary components to mock process of fetching data, should replace to infinite loading in the future */}
      <LoadMoreButton onClick={fetchMoreLatestNews}>
        載入更多（fetch json檔）
      </LoadMoreButton>
      <LoadMoreButton onClick={showMoreLatestNews}>
        顯示更多（顯示20筆）
      </LoadMoreButton>
    </Wrapper>
  )
}
