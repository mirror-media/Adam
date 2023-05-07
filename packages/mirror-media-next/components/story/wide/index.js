import { useCallback } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import client from '../../../apollo/apollo-client'
import DraftRenderBlock from '../shared/draft-renderer-block'

import {
  transformTimeDataIntoDotFormat,
  sortArrayWithOtherArrayId,
} from '../../../utils'
import { URL_STATIC_POPULAR_NEWS, API_TIMEOUT } from '../../../config/index.mjs'
import DonateLink from '../shared/donate-link'
import HeroImageAndVideo from './hero-image-and-video'
import DonateBanner from '../shared/donate-banner'
import RelatedArticleList from './related-article-list'
import AsideArticleList from './aside-article-list'
import Divider from '../shared/divider'
import { fetchAsidePosts } from '../../../apollo/query/posts'

/**
 * @typedef {import('../../../apollo/fragments/post').Post} PostData
 */

const Main = styled.main`
  margin: auto;
  width: 100%;
  height: 100vh;
  background-color: white;
`
const StyledDonateLink = styled(DonateLink)`
  margin: 20px auto 0;
  ${({ theme }) => theme.breakpoint.md} {
    margin: 12px auto 0;
  }
`
const DateWrapper = styled.div`
  margin-top: 16px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 20px;
  }
`
const Date = styled.div`
  width: fit-content;
  height: auto;
  font-size: 14px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.5);
  margin: 8px auto 0;

  ${({ theme }) => theme.breakpoint.md} {
    line-height: 1.8;
    margin: 0 auto;
  }
`
const ContentWrapper = styled.section`
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px 20px;
  border: none;

  .content {
    width: 100%;
    margin: 20px auto 0;
    max-width: 640px;
  }

  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 0 32px;

    border-bottom: 1px black solid;
    .content {
      margin: 40px auto 0;
    }
  }
`
const StyledDonateBanner = styled(DonateBanner)`
  margin-left: 10px;
  margin-right: 10px;
  width: 100%;
  max-width: 640px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-left: auto;
    margin-right: auto;
  }
`
const Aside = styled.aside`
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
 *
 * @param {Object} param
 * @param {PostData} param.postData
 * @returns
 */
export default function StoryWideStyle({ postData }) {
  const {
    title = '',
    heroImage = null,
    heroVideo = null,
    heroCaption = '',
    updatedAt = '',
    publishedDate = '',
    sections = [],
    manualOrderOfSections = [],
    relateds = [],
    slug = '',
    content = null,
    brief = null,
  } = postData
  const updatedAtFormatTime = transformTimeDataIntoDotFormat(updatedAt)
  const publishedDateFormatTime = transformTimeDataIntoDotFormat(publishedDate)
  const sectionsWithOrdered =
    manualOrderOfSections && manualOrderOfSections.length
      ? sortArrayWithOtherArrayId(sections, manualOrderOfSections)
      : sections
  const [section] = sectionsWithOrdered

  /**
   * @returns {Promise<AsideArticleData[] | []>}
   */
  const handleFetchLatestNews = useCallback(async () => {
    try {
      /**
       * @type {import('@apollo/client').ApolloQueryResult<{posts: any[]}>}
       */
      const res = await client.query({
        query: fetchAsidePosts,
        variables: {
          take: 6,
          sectionSlug: section.slug,
          storySlug: slug,
        },
      })
      return res.data?.posts
    } catch (err) {
      console.error(err)
      return []
    }
  }, [section, slug])

  /**
   * @returns {Promise<any[] | []>}
   */
  const handleFetchPopularNews = async () => {
    try {
      /**
       * @type {import('axios').AxiosResponse<any[] | []>}>}
       */
      const { data } = await axios({
        method: 'get',
        url: URL_STATIC_POPULAR_NEWS,
        timeout: API_TIMEOUT,
      })
      return data.filter((data) => data).slice(0, 6)
    } catch (err) {
      return []
    }
  }

  return (
    <Main>
      <article>
        <HeroImageAndVideo
          heroImage={heroImage}
          heroVideo={heroVideo}
          heroCaption={heroCaption}
          title={title}
        />
        <ContentWrapper>
          <DateWrapper>
            <Date>更新時間 {updatedAtFormatTime}</Date>
            <Date>發布時間 {publishedDateFormatTime}</Date>
          </DateWrapper>
          <StyledDonateLink />
          <section className="content">
            <DraftRenderBlock rawContentBlock={brief} contentLayout="wide" />
            <DraftRenderBlock rawContentBlock={content} contentLayout="wide" />
          </section>
          <StyledDonateBanner />
        </ContentWrapper>
        <Aside>
          <RelatedArticleList relateds={relateds} />
          <AsideArticleList
            heading="最新文章"
            fetchArticle={handleFetchLatestNews}
            shouldReverseOrder={false}
            renderAmount={6}
          />
          <Divider />
          <AsideArticleList
            heading="熱門文章"
            fetchArticle={handleFetchPopularNews}
            shouldReverseOrder={false}
            renderAmount={6}
          />
        </Aside>
      </article>
    </Main>
  )
}
