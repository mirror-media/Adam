import ListArticles from './list-articles'
import styled from 'styled-components'
import { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { fetchTopic } from '../../../apollo/query/topics'
import LoadingPage from '../../../public/images-next/loading_page.gif'

import Image from 'next/image'
/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

const ShowMoreButton = styled.button`
  display: block;
  width: 240px;
  margin: 0 auto;
  height: 72px;
  border: 1px solid;
  position: relative;

  ${
    /**
     * @param {Object} props
     * @param {Theme} [props.theme]
     * @param {boolean} props.isLoading
     */
    ({ theme }) => theme.color.brandColor.darkBlue
  };
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);

  color: ${({ theme }) => theme.color.brandColor.darkBlue};
  font-size: 18px;
  line-height: 1.5;
  border-radius: 12px;
  background: #ffffff;
  &:hover {
    background: linear-gradient(
      0deg,
      rgba(5, 79, 119, 0.05),
      rgba(5, 79, 119, 0.05)
    );
  }
  &:focus {
    outline: none;
  }
  img {
    position: absolute;
    right: 50%;
    bottom: 50%;
    transform: translate(50%, 50%);
    visibility: ${({ isLoading }) => (isLoading ? 'visible' : 'hidden')};
    margin: 0 auto;
  }
  span {
    visibility: ${({ isLoading }) => (isLoading ? 'hidden' : 'visible')};
  }
  cursor: ${({ isLoading }) => (isLoading ? 'not-allowed' : 'pointer')};
  transition: background-color 0.5s ease;
`
const Loader = () => {
  return <Image src={LoadingPage} alt="loading page"></Image>
}
export default function ListArticlesAboveAd({
  posts = [],
  topicSlug = '',
  featuredPostsCount = 0,
  renderPageSize = 12,
}) {
  const [renderPosts, setRenderPosts] = useState(posts)

  /**
   * Two situation:
   * 1. `featurePostsCount` is greater than `renderPosts.length`, which means there are some featured post is not fetched and render yet.
   * 2.  `featurePostsCount` is equal to or lower than `renderPosts.length`, which means all featured post has rendered.
   */
  const hasMoreFeaturedPosts = featuredPostsCount > renderPosts.length
  const [getFeaturedPostsInTopic, { loading, error }] = useLazyQuery(
    fetchTopic,
    {
      variables: {
        topicFilter: { slug: { equals: topicSlug } },
        postsFilter: {
          state: { equals: 'published' },
          isFeatured: { equals: true },
        },
        postsOrderBy: [{ isFeatured: 'desc' }, { publishedDate: 'desc' }],
        postsTake: renderPageSize,
        postsSkip: renderPosts.length,
      },
    }
  )

  const handleLoadMore = async () => {
    const res = await getFeaturedPostsInTopic()

    if (res.called && !loading && !error) {
      const newPosts = res.data?.topics?.[0].posts

      setRenderPosts((pre) => [...pre, ...newPosts])
    } else {
      console.error(res.error)
    }
  }

  return (
    <>
      <ListArticles renderList={renderPosts} />

      {hasMoreFeaturedPosts && (
        <ShowMoreButton
          disabled={loading}
          isLoading={loading}
          onClick={handleLoadMore}
        >
          <Loader />
          <span>看更多</span>
        </ShowMoreButton>
      )}
    </>
  )
}
