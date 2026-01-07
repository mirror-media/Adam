//TODO: adjust function `handleFetchPopularNews` and `handleFetchPopularNews`, make it more reuseable in other pages.

import styled from 'styled-components'
import RelatedArticleList from './related-article-list'
import AsideArticleList from './aside-article-list'
import Divider from './divider'
import axiosInstance from '../../../axios/index.js'

import {
  URL_STATIC_POPULAR_NEWS,
  API_TIMEOUT,
  URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION,
  GCS_FUSE_STATIC_BUCKET,
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
 * @returns {import('react').JSX.Element}
 */
export default function Aside({
  relateds = [],
  sectionSlug = '',
  storySlug = '',
}) {
  const logPrefix = '[story-aside]'
  const buildFallbackUrl = (baseUrl, filename) => {
    try {
      const parsed = new URL(baseUrl)
      // Use configured bucket name instead of hostname to ensure correct environment
      const bucket = GCS_FUSE_STATIC_BUCKET || parsed.hostname
      
      // Extract pathname from base URL and replace filename
      // e.g., /files/json/sections -> /files/json/latest/section_xxx.json
      // or /files/json/popular.json -> /json/latest/popular.json
      const pathname = parsed.pathname
      const pathParts = pathname.split('/').filter(Boolean)
      
      // Determine the correct path structure
      // If pathname contains /files/json/, use /json/latest/
      // Otherwise, use the existing structure with /json/latest/
      if (pathParts.includes('files') && pathParts.includes('json')) {
        // Original: /files/json/sections -> fallback: /json/latest/section_xxx.json
        return `https://storage.googleapis.com/${bucket}/json/latest/${filename}`
      } else if (pathParts.includes('json')) {
        // Original: /json/popular.json -> fallback: /json/latest/popular.json
        return `https://storage.googleapis.com/${bucket}/json/latest/${filename}`
      }
      
      // Fallback to original structure if path doesn't match expected patterns
      return `https://storage.googleapis.com/${bucket}/json/latest/${filename}`
    } catch (err) {
      console.warn('buildFallbackUrl error:', err?.message ?? err)
      return ''
    }
  }

  /**
   * @returns {Promise<ArticleDataContainSectionsWithOrdered[] | []>}
   */
  const handleFetchLatestNews = async () => {
    try {
      /**
       * @type {import('@apollo/client').ApolloQueryResult<{posts: AsideArticleData[]}>}
       */
      console.log(
        logPrefix,
        'fetch latest',
        `${URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION}/section_${sectionSlug}.json`
      )
      const res = await axiosInstance({
        method: 'get',
        url: `${URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION}/section_${sectionSlug}.json`,
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
      // fallback to json/latest
      try {
        const fallbackUrl = buildFallbackUrl(
          URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION,
          `section_${sectionSlug}.json`
        )
        console.warn(logPrefix, 'latest fallback', fallbackUrl)
        if (!fallbackUrl) return []
        const res = await axiosInstance({
          method: 'get',
          url: fallbackUrl,
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
      } catch (fallbackErr) {
        console.error(fallbackErr)
      return []
      }
    }
  }

  /**
   * @returns {Promise<ArticleDataContainSectionsWithOrdered[] | []>}
   */
  const handleFetchPopularNews = async () => {
    try {
      console.log(logPrefix, 'fetch popular', URL_STATIC_POPULAR_NEWS)
      const { data } = await axiosInstance({
        method: 'get',
        url: URL_STATIC_POPULAR_NEWS,
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
      // fallback: convert CDN URL to direct GCS URL with same path
      try {
        const parsed = new URL(URL_STATIC_POPULAR_NEWS)
        const bucket = GCS_FUSE_STATIC_BUCKET || parsed.hostname
        const pathname = parsed.pathname
        // Convert CDN URL to direct GCS URL, keeping the same path
        // e.g., https://v3-statics-dev.mirrormedia.mg/files/json/popular.json
        // -> https://storage.googleapis.com/v3-statics-dev.mirrormedia.mg/files/json/popular.json
        const fallbackUrl = `https://storage.googleapis.com/${bucket}${pathname}`
        console.warn(logPrefix, 'popular fallback', fallbackUrl)
        const { data } = await axiosInstance({
          method: 'get',
          url: fallbackUrl,
        })
        return data
          .map((post) => {
            const sectionsWithOrdered = getActiveOrderSection(
              post.sections,
              post.sectionsInInputOrder
            )
            return { sectionsWithOrdered, ...post }
          })
          .slice(0, 6)
      } catch (fallbackErr) {
        console.error(fallbackErr)
        return []
      }
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
