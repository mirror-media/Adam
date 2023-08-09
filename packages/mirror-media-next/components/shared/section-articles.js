import styled from 'styled-components'
import Image from 'next/legacy/image'

import InfiniteScrollList from '../infinite-scroll-list'
import ArticleList from './article-list'
import PremiumArticleList from './premium-article-list'
import { fetchPostsBySectionSlug } from '../../utils/api/section'
import LoadingPage from '../../public/images/loading_page.gif'
import { fetchPremiumPostsBySectionSlug } from '../../utils/api/premiumsection'

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
 * @typedef {import('../shared/article-list').Article} Article
 * @typedef {import('../../apollo/fragments/section').Section } Section
 */

/**
 *
 * @param {Object} props
 * @param {Number} props.postsCount
 * @param {Article[]} props.posts
 * @param {Section} props.section
 * @param {number} props.renderPageSize
 * @param {boolean} [props.isPremium]
 * @returns {React.ReactElement}
 */
export default function SectionArticles({
  postsCount,
  posts,
  section,
  renderPageSize,
  isPremium = false,
}) {
  const fetchPageSize = renderPageSize * 2

  async function fetchPostsFromPage(page) {
    if (!section?.slug) {
      return
    }
    try {
      const take = fetchPageSize
      const skip = (page - 1) * take
      const response = await fetchPostsBySectionSlug(section.slug, take, skip)
      return response.data.posts
    } catch (error) {
      // [to-do]: use beacon api to log error on gcs
      console.error(error)
    }
    return
  }

  async function fetchPremiumPostsFromPage(page) {
    if (!section?.slug) {
      return
    }
    try {
      const take = fetchPageSize
      const skip = (page - 1) * take
      const response = await fetchPremiumPostsBySectionSlug(
        section.slug,
        take,
        skip
      )
      return response.data.posts
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
      initialList={posts}
      renderAmount={renderPageSize}
      fetchCount={Math.ceil(postsCount / fetchPageSize)}
      fetchListInPage={
        isPremium ? fetchPremiumPostsFromPage : fetchPostsFromPage
      }
      loader={loader}
    >
      {(renderList) =>
        isPremium ? (
          <PremiumArticleList renderList={renderList} section={section} />
        ) : (
          <ArticleList renderList={renderList} section={section} />
        )
      }
    </InfiniteScrollList>
  )
}
