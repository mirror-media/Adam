import React from 'react'
import styled from 'styled-components'

import LatestNewsItem from './latest-news-item'

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
/**
 *
 * @param {Object} props
 * @param {Object} props.latestNewsData
 * @returns {React.ReactElement}
 */
export default function LatestNews({ latestNewsData }) {
  console.log(latestNewsData[0])
  return (
    <Wrapper>
      <h2>最新文章</h2>
      <ItemContainer>
        {latestNewsData.map((item, index) => (
          <LatestNewsItem key={index}></LatestNewsItem>
        ))}
      </ItemContainer>
    </Wrapper>
  )
}
