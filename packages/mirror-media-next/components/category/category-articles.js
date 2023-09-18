import styled from 'styled-components'
import Image from 'next/legacy/image'

import InfiniteScrollList from '../infinite-scroll-list'
import ArticleList from '../shared/article-list'
import PremiumArticleList from '../shared/premium-article-list'
import {
  fetchPostsByCategorySlug,
  fetchPremiumPostsByCategorySlug,
} from '../../utils/api/category'
import LoadingPage from '../../public/images-next/loading_page.gif'

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
 * @typedef {import('../shared/article-list').Section} Section
 * @typedef {import('../../apollo/fragments/category').Category} Category
 */

/**
 *
 * @param {Object} props
 * @param {Number} props.postsCount
 * @param {Article[]} props.posts
 * @param {Category} props.category
 * @param {Number} props.renderPageSize
 * @param {boolean} props.isPremium
 * @returns {React.ReactElement}
 */
export default function CategoryArticles({
  postsCount,
  posts,
  category,
  renderPageSize,
  isPremium,
}) {
  const fetchPageSize = renderPageSize * 2

  async function fetchPostsFromPage(page) {
    if (!category?.slug) {
      return
    }
    try {
      const take = fetchPageSize
      const skip = (page - 1) * take
      const response = isPremium
        ? await fetchPremiumPostsByCategorySlug(category.slug, take, skip)
        : await fetchPostsByCategorySlug(category.slug, take, skip)
      return response.data.posts
    } catch (error) {
      // [to-do]: use beacon api to log error on gcs
      console.error(error)
      return
    }
  }

  const loader = (
    <Loading key={0}>
      <Image src={LoadingPage} alt="loading page"></Image>
    </Loading>
  )

  return (
    <>
      <InfiniteScrollList
        initialList={posts}
        renderAmount={renderPageSize}
        fetchCount={Math.ceil(postsCount / fetchPageSize)}
        fetchListInPage={fetchPostsFromPage}
        loader={loader}
      >
        {(renderList) =>
          isPremium ? (
            <PremiumArticleList renderList={renderList} />
          ) : (
            <ArticleList
              renderList={renderList}
              section={category.sections[0]}
            />
          )
        }
      </InfiniteScrollList>
    </>
  )
}
