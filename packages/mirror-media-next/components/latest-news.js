import React from 'react'
import styled from 'styled-components'

import LatestNewsItem from './latest-news-item'
import { transformRawDataToArticleInfo } from '../utils'
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

/**
 * @param {Object} props
 * @param {import('../type/raw-data.typedef').RawData[]} [props.latestNewsData=[]]
 * @returns {React.ReactElement}
 */
export default function LatestNews({ latestNewsData = [] }) {
  /** @type {import('../type/index').ArticleInfoCard[]} */
  const latestNews = transformRawDataToArticleInfo(latestNewsData)
  return (
    <Wrapper>
      <h2>最新文章</h2>
      <ItemContainer>
        {latestNews.map((item) => (
          <LatestNewsItem key={item.slug} itemData={item}></LatestNewsItem>
        ))}
      </ItemContainer>
      {/* Temporary components to mock process of fetching data, should replace to infinite loading in the future */}
      <LoadMoreButton>載入更多</LoadMoreButton>
    </Wrapper>
  )
}
