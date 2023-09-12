//TODO: adjust function `handleFetchPopularNews` and `handleFetchPopularNews`, make it more reuseable in other pages.

import styled from 'styled-components'
import RelatedArticleList from './related-article-list'
import AsideArticleList from './aside-article-list'
import Divider from './divider'
import axios from 'axios'

import {
  URL_STATIC_POPULAR_NEWS,
  API_TIMEOUT,
  URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION,
} from '../../../config/index.mjs'

import { getActiveOrderSection } from '../../../utils'

/**
 * @typedef {import('./related-article-list').Relateds} Relateds
 */
/**
 * @typedef {import('./aside-article-list').ArticleData} AsideArticleData
 * @typedef {import('./aside-article-list').ArticleDataContainSectionsWithOrdered} ArticleDataContainSectionsWithOrdered
 */

/**
 * @typedef {import('../../../apollo/fragments/section').Section} Section
 */

const AsideWrapper = styled.aside`
  width: 100%;
  max-width: 640px;
  margin: 20px auto;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 32px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 64px;
  }
`
/**
 * Component for rendering aside of story page, which contain related posts, latest news, popular news.
 * Currently used at wide layout and premium layout of story page.
 * @param {Object} props
 * @param {Relateds} props.relateds - The related post.
 * @param {string} props.sectionSlug - The slug of section, this props will decide which section of latest news belongs to.
 * @param {string} props.storySlug - The slug of story, the function of fetching latest news will skip the post with this slug.
 * @returns {JSX.Element}
 */
export default function Aside({
  relateds = [],
  sectionSlug = '',
  storySlug = '',
}) {
  /**
   * @returns {Promise<ArticleDataContainSectionsWithOrdered[] | []>}
   */
  const handleFetchLatestNews = async () => {
    try {
      /**
       * @type {import('@apollo/client').ApolloQueryResult<{posts: AsideArticleData[]}>}
       */
      const res = await axios({
        method: 'get',
        url: `${URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION}/section_${sectionSlug}.json`,
        timeout: API_TIMEOUT,
      })
      return res.data?.posts
        .filter((post) => post.slug !== storySlug)
        .slice(0, 6)
        .map((post) => {
          const sectionsWithOrdered = getActiveOrderSection(
            post.sections,
            post.sectionsInInputOrder
          )
          return { sectionsWithOrdered, ...post }
        })
    } catch (err) {
      console.error(err)
      return []
    }
  }

  /**
   * @returns {Promise<ArticleDataContainSectionsWithOrdered[] | []>}
   */
  const handleFetchPopularNews = async () => {
    try {
      /**
       * @type {import('axios').AxiosResponse<AsideArticleData[] | []>}>}
       */
      const { data } = await axios({
        method: 'get',
        url: URL_STATIC_POPULAR_NEWS,
        timeout: API_TIMEOUT,
      })

      const popularNews = data
        .map((post) => {
          const sectionsWithOrdered = getActiveOrderSection(
            post.sections,
            post.sectionsInInputOrder
          )
          return { sectionsWithOrdered, ...post }
        })
        .slice(0, 6)

      return popularNews
    } catch (err) {
      return []
    }
  }

  return (
    <AsideWrapper>
      {relateds.length > 0 && <RelatedArticleList relateds={relateds} />}
      <AsideArticleList
        listType={'latestNews'}
        fetchArticle={handleFetchLatestNews}
        renderAmount={6}
      />
      <Divider />
      <AsideArticleList
        listType={'popularNews'}
        fetchArticle={handleFetchPopularNews}
        renderAmount={6}
      />
    </AsideWrapper>
  )
}
