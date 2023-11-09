import styled from 'styled-components'
import dynamic from 'next/dynamic'

import ListArticlesAboveAd from './list-articles-above-ad'
import ListArticlesBelowAd from './list-articles-below-ad'

const GPTAd = dynamic(() => import('../../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})
import { useDisplayAd } from '../../../hooks/useDisplayAd'
const StyledGPTAd = styled(GPTAd)`
  width: 100%;
  height: auto;
  margin: 0 auto 20px auto;
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 0 auto 35px auto;
  }
`

/**
 * @typedef {import('./list-articles').Article} Article
 */

/**
 *
 * @param {Object} props
 * @param {number} props.postsCount
 * @param {number} props.featuredPostsCount
 * @param {Article[]} props.initialPosts
 * @param {string} props.topicSlug
 * @param {number} props.renderPageSize
 * @param {string} props.dfp
 * @returns {React.ReactElement}
 */
export default function TopicListArticles({
  postsCount: totalPostsCount,
  featuredPostsCount,
  initialPosts,
  topicSlug,
  renderPageSize,
  dfp,
}) {
  const shouldShowAd = useDisplayAd()
  const hasNonFeaturedPostsInListAboveAd = initialPosts.some(
    (post) => !post.isFeatured
  )

  /**
   * Handle logic of render component `ListArticlesBelowAd`.
   * Two situation need to handle:
   * 1. Has non-featured post in `initialPosts`:
   *    - We check whether all posts has been fetched and displayed.
   *    - For example, if `totalPostsCount` is 30 , and `initialPosts.length` is 12, which means there are 18 posts not fetched yet
   *      and should fetch and render at `ListArticlesBelowAd`.
   *    - If `totalPostsCount` is 10 , and `initialPosts.length` is 10, which means all post has been fetched and render at `ListArticlesAboveAd`,
   *      and no need to render component `ListArticlesBelowAd`.
   * 2. No non-featured post in `initialPosts`, all post in `initialPosts` is featured:
   *    - We check whether has non-featured post.
   *    - For example, if `totalPostsCount` is 50 , and `featuredPostsCount` is 30, which means there are 20 non-featured posts
   *      and should fetch and render at `ListArticlesBelowAd`.
   *    - If `totalPostsCount` is 50 , and `initialPosts.length` is 50, which means all post are featured posts and should render at `ListArticlesAboveAd`
   *      and no need to render component `ListArticlesBelowAd`.
   */
  const shouldShowListArticlesBelowAd = hasNonFeaturedPostsInListAboveAd
    ? totalPostsCount > initialPosts.length
    : totalPostsCount > featuredPostsCount
  return (
    <>
      <ListArticlesAboveAd
        posts={initialPosts}
        topicSlug={topicSlug}
        featuredPostsCount={featuredPostsCount}
        renderPageSize={renderPageSize}
      ></ListArticlesAboveAd>
      {shouldShowAd && dfp && <StyledGPTAd adUnit={dfp}></StyledGPTAd>}
      {shouldShowListArticlesBelowAd && (
        <ListArticlesBelowAd
          topicSlug={topicSlug}
          hasNonFeaturedPostsInListAboveAd={hasNonFeaturedPostsInListAboveAd}
          renderPageSize={renderPageSize}
          totalPostsCount={totalPostsCount}
          featuredPostsCount={featuredPostsCount}
        />
      )}
    </>
  )
}
