import styled from 'styled-components'
import axios from 'axios'
import InfiniteScroll from './infinite-scroll-list'
import LoadingPage from '../public/images/loading_page.gif'
import LatestNewsItem from './latest-news-item'
import { transformRawDataToArticleInfo } from '../utils'
import { URL_STATIC_POST_EXTERNAL } from '../config'
import Image from 'next/legacy/image'

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

/** number of json files has latest news, and we need to fetch  */
const JSON_FILE_COUNT = 4
/**
 * @typedef {import('../type/raw-data.typedef').RawData} RawData
 */
/**
 * @typedef {import('../type/index').ArticleInfoCard} ArticleInfoCard
 */

/**
 * @param {RawData[]} articleRawData
 * @returns {RawData[]}
 */
function removeArticleWithExternalLink(articleRawData) {
  return articleRawData?.filter((item) => {
    if (!item.redirect) {
      return item
    }
    const redirectLink = item.redirect?.trim()
    return (
      !redirectLink.startsWith('https://') &&
      !redirectLink.startsWith('http://') &&
      !redirectLink.startsWith('www.')
    )
  })
}

/**
 * @param {RawData[]} articleRawData
 * @returns {ArticleInfoCard[]}
 */
const transformRawDataContent = function (articleRawData) {
  return transformRawDataToArticleInfo(
    removeArticleWithExternalLink(articleRawData)
  )
}
/**
 * @param {Object} props
 * @param {RawData[]} [props.latestNewsData = []]
 * @param {String} [props.latestNewsTimestamp = '']
 * @returns {JSX.Element}
 */

export default function LatestNews(props) {
  /**
   * Fetch certain json file
   * @async
   * @param {Number} [serialNumber = 1]
   * @returns {Promise<RawData[] | []> }
   */
  async function fetchCertainLatestNews(serialNumber = 1) {
    try {
      const { data } = await axios({
        method: 'get',
        url: `${URL_STATIC_POST_EXTERNAL}0${serialNumber}.json`,
        timeout: 5000, //since size of json file is large, we assign timeout as 5000ms to prevent content lost in poor network condition
      })
      /** @type {import('../type/raw-data.typedef').RawData[]} */
      if (Array.isArray(data.latest)) {
        return data.latest
      }
      return []
    } catch (e) {
      console.error(e)
      return []
    }
  }
  /**
   * fetch another json file
   * @async
   * @param {number} page
   */
  async function fetchMoreLatestNews(page) {
    const latestNewsData = await fetchCertainLatestNews(page)
    /** @type {ArticleInfoCard[]} */
    const latestNews = transformRawDataContent(latestNewsData)
    return latestNews
  }

  return (
    <Wrapper>
      <h2>最新文章</h2>
      <InfiniteScroll
        initialList={transformRawDataContent([...props.latestNewsData])}
        renderAmount={RENDER_PAGE_SIZE}
        fetchListInPage={fetchMoreLatestNews}
        loader={
          <Loading>
            <Image src={LoadingPage} alt="loading page"></Image>
          </Loading>
        }
        fetchCount={JSON_FILE_COUNT}
      >
        {(renderList) => (
          <ItemContainer>
            {renderList.map((item) => (
              <LatestNewsItem key={item.slug} itemData={item}></LatestNewsItem>
            ))}
          </ItemContainer>
        )}
      </InfiniteScroll>
    </Wrapper>
  )
}
