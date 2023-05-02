import { useCallback } from 'react'
import styled from 'styled-components'
import client from '../../../apollo/apollo-client'

import {
  transformTimeDataIntoDotFormat,
  sortArrayWithOtherArrayId,
} from '../../../utils'
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
  max-width: 640px;
  margin: 0 auto;
  padding-bottom: 20px;
  border: none;
  ${({ theme }) => theme.breakpoint.md} {
    padding-bottom: 32px;
    border-bottom: 1px black solid;
  }
`
const StyledDonateBanner = styled(DonateBanner)`
  margin-left: 10px;
  margin-right: 10px;
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
          <div>這是前言</div>
          <div>這是內文</div>

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
            heading="最新文章"
            fetchArticle={handleFetchLatestNews}
            shouldReverseOrder={false}
            renderAmount={6}
          />
        </Aside>
      </article>
    </Main>
  )
}
