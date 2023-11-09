import styled from 'styled-components'
import InfiniteScrollList from '../../infinite-scroll-list'
import Image from 'next/legacy/image'
// @ts-ignore
import LoadingPage from '../../../public/images-next/loading_page.gif'
import ListArticles from './list-articles'
import { fetchTopicByTopicSlug } from '../../../utils/api/topic'

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
 * TODO: add comment to explain props
 * @param {Object} props
 * @param {string} props.topicSlug
 * @param {boolean} props.hasNonFeaturedPostsInListAboveAd
 * @param {number} props.renderPageSize
 * @param {number} props.totalPostsCount
 * @param {number} props.featuredPostsCount
 * @returns
 */
export default function ListArticlesBelowAd({
  topicSlug,
  hasNonFeaturedPostsInListAboveAd,
  renderPageSize,
  totalPostsCount,
  featuredPostsCount,
}) {
  /**
   * Calculate how many total posts should render in this component.
   * The value is depend on how many featured posts in certain topic (featured post will displayed at another component <`<ListArticlesAboveAd>`>)
   * Two situation should be handled:
   * 1. `featuredPostsCount` is greater than or equal to `renderPageSize`:
   *    - The `<ListArticlesAboveAd>` component only shows featured posts,
   *      and the `postsCount` only counts non-featured posts.
   * 2. `featuredPostsCount` is lower than `renderPageSize`:
   *    - The `<ListArticlesAboveAd>` component will include both featured and non-featured posts,
   *      while the `postsCount` counts all posts except for the ones rendered in `<ListArticlesAboveAd>`.
   */
  const postsCount =
    totalPostsCount -
    (featuredPostsCount >= renderPageSize ? featuredPostsCount : renderPageSize)
  const fetchPageSize = renderPageSize

  async function fetchTopicPostsFromPage(page) {
    if (!topicSlug) {
      return
    }
    try {
      const take = fetchPageSize

      const minimumSkipAmount = hasNonFeaturedPostsInListAboveAd
        ? take
        : featuredPostsCount
      const skip = (page - 1) * take + minimumSkipAmount

      const response = await fetchTopicByTopicSlug(topicSlug, take, skip)
      return response.data.topics[0].posts
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
    <>
      <InfiniteScrollList
        renderAmount={renderPageSize}
        fetchCount={Math.ceil(postsCount / fetchPageSize)}
        fetchListInPage={fetchTopicPostsFromPage}
        loader={loader}
      >
        {(renderList) => <ListArticles renderList={renderList} />}
      </InfiniteScrollList>
    </>
  )
}
