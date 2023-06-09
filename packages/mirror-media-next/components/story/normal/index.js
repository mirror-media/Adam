//TODO: adjust margin and padding of all margin and padding after implement advertisement.
//TODO: refactor jsx structure, make it more readable.

import { useCallback, useState, useEffect } from 'react'
import client from '../../../apollo/apollo-client'
import styled, { css } from 'styled-components'
import Link from 'next/link'
import axios from 'axios'
import errors from '@twreporter/errors'
import MockAdvertisement from '../../../components/mock-advertisement'
import ArticleInfo from '../../../components/story/normal/article-info'
import ArticleBrief from '../shared/brief'
import AsideArticleList from '../../../components/story/normal/aside-article-list'
import FbPagePlugin from '../../../components/story/normal/fb-page-plugin'
import SocialNetworkService from '../../../components/story/normal/social-network-service'
import SubscribeInviteBanner from '../../../components/story/normal/subscribe-invite-banner'
import DonateBanner from '../../../components/story/shared/donate-banner'
import MagazineInviteBanner from '../../../components/story/shared/magazine-invite-banner'
import RelatedArticleList from '../../../components/story/normal/related-article-list'
import ArticleContent from './article-content'
import HeroImageAndVideo from './hero-image-and-video'
import Divider from '../shared/divider'
import ShareHeader from '../../shared/share-header'
import {
  transformTimeDataIntoDotFormat,
  sortArrayWithOtherArrayId,
} from '../../../utils'
import { fetchHeaderDataInDefaultPageLayout } from '../../../utils/api'
import { fetchAsidePosts } from '../../../apollo/query/posts'
import { URL_STATIC_POPULAR_NEWS, API_TIMEOUT } from '../../../config/index.mjs'
import DableAd from '../../ads/dable/dable-ad'
/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

/**
 * @typedef {import('../../../components/story/normal/aside-article-list').ArticleData} AsideArticleData
 */

/**
 * @typedef {import('../../../components/story/normal/article-info').Contacts} Contacts
 */

/**
 * @typedef {import('../../../apollo/fragments/section').Section[] } Sections
 */

/**
 * @typedef {import('../../../components/story/normal/hero-image-and-video').HeroImage} HeroImage
 */

/**
 * @typedef {import('../../../components/story/normal/hero-image-and-video').HeroVideo} HeroVideo
 */

/**
 * @typedef {import('../shared/brief').Brief} Brief
 */
/**
 * @typedef {import('./article-content').Content} Content
 */

/**
 * @typedef {import('../../../components/story/normal/related-article-list').Relateds} Relateds
 */

/**
 * @typedef {import('../../../apollo/fragments/post').Post } PostData
 */
/**
 * @typedef {import('../../../type/draft-js').Draft} PostContent
 */

const sectionColor = css`
  ${
    /**
     * @param {Object} props
     * @param {String} [props.sectionSlug]
     * @param {Theme} [props.theme]
     */
    ({ sectionSlug, theme }) =>
      sectionSlug && theme.color.sectionsColor[sectionSlug]
        ? theme.color.sectionsColor[sectionSlug]
        : 'black'
  };
`

const PC_HD_Advertisement = styled(MockAdvertisement)`
  display: none;
  margin: 24px auto;
  text-align: center;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
  }
`
const PC_R1_Advertisement = styled(MockAdvertisement)`
  display: none;
  margin: 0 auto;
  text-align: center;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
  }
`
const PC_R2_Advertisement = styled(MockAdvertisement)`
  display: none;
  margin: 20px auto;
  text-align: center;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
  }
`
const M_AT3_Advertisement = styled(MockAdvertisement)`
  margin: 0 -20px;
  width: 100vw;
  max-width: 336px;
  @media (min-width: 336px) {
    margin: 0 auto;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const Title = styled.h1`
  margin: 0 auto;
  width: 100%;
  text-align: center;
  font-weight: 400;
  font-size: 24px;
  line-height: 34px;
  ${({ theme }) => theme.breakpoint.md} {
    font-weight: 500;
    font-size: 32px;
    line-height: 1.25;
    text-align: left;
  }
`
const Main = styled.main`
  margin: 20px auto 0;
  width: 100%;
  height: auto;
  max-width: 1200px;
  padding: 0 20px;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 64px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 24px auto 0;
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: space-between;
    padding: 0 40px 0 77px;
  }
`
const Article = styled.article`
  max-width: 640px;
  margin: 0 auto;
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 35px 0 0 0;
  }
`

const Section = styled.div`
  color: ${
    /**
     * @param {{ sectionSlug: String}} props
     */
    ({ sectionSlug }) => sectionSlug && sectionColor
  };
  margin-left: 4px;
  padding-left: 8px;
  position: relative;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
    line-height: 25px;
    text-align: left;
  }
  &::before {
    display: none;

    ${({ theme }) => theme.breakpoint.md} {
      display: block;
      position: absolute;
      content: '';
      background-color: ${({ sectionSlug }) => sectionSlug && sectionColor};
      left: -4px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
    }
  }
`

const Date = styled.div`
  width: fit-content;
  height: auto;
  font-size: 14px;
  line-height: 1.5;
  color: #a1a1a1;
  display: none;
  ${({ theme }) => theme.breakpoint.md} {
    display: block;
  }
`
const DateUnderContent = styled(Date)`
  color: ${({ theme }) => theme.color.brandColor.darkBlue};
  font-size: 16px;
  line-height: 1.15;
  margin-top: 32px;
  .time {
    color: ${({ theme }) => theme.color.brandColor.lightBlue};
  }
`
const SectionAndDate = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
  ${({ theme }) => theme.breakpoint.md} {
    justify-content: space-between;
    margin-bottom: 10px;
  }
`

const StyledHeroImageAndVideo = styled(HeroImageAndVideo)``
const InfoAndHero = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoint.md} {
    ${StyledHeroImageAndVideo} {
      order: 10;
    }
  }
`
const SocialNetworkServiceSmall = styled(SocialNetworkService)`
  display: none;
  ${({ theme }) => theme.breakpoint.md} {
    display: flex;
    margin-top: 20px;
  }
`
const SocialNetworkServiceLarge = styled(SocialNetworkService)`
  display: flex;
  margin-top: 20px;
  margin-bottom: 24px;
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`
const StoryMoreInfo = styled.p`
  font-size: 18px;
  line-height: 1.5;
  color: black;
  margin: 0 auto;
  text-align: center;
  a {
    color: ${({ theme }) => theme.color.brandColor.lightBlue};
    border-bottom: 1px solid ${({ theme }) => theme.color.brandColor.lightBlue};
  }
`

const StoryEnd = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 60px auto 0;
  padding: 0 23.5px;
  ${({ theme }) => theme.breakpoint.md} {
    width: 640px;

    margin-top: 24px auto 0;
    gap: 16px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    gap: 36px;
    padding: 0;
  }
`
const StoryEndMobileTablet = styled(StoryEnd)`
  display: flex;
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`
const StoryEndDesktop = styled(StoryEnd)`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: flex;
  }
`
const Aside = styled.aside`
  width: 100%;
  ${({ theme }) => theme.breakpoint.xl} {
    width: 365px;
  }
`

const AsideFbPagePlugin = styled(FbPagePlugin)`
  display: none;
  text-align: center;
  height: 500px;
  margin: 20px 0;
  ${
    /**
     * @param {Object} param
     * @param {Theme} param.theme
     */
    ({ theme }) => theme.breakpoint.md
  } {
    display: block;
  }
`
const AdvertisementDable = styled.div`
  text-align: center;
  background-color: #eeeeee;
`
const AdvertisementDableDesktop = styled(AdvertisementDable)`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    width: 640px;
    margin: 0 auto;
  }
`
const AdvertisementDableMobile = styled(AdvertisementDable)`
  display: block;
  margin: 0 auto;
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
    width: 640px;
  }
`
const HeaderPlaceHolder = styled.header`
  background-color: transparent;
  height: 175px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`

/**
 *
 * @param {{postData: PostData,postContent: PostContent}} param
 * @returns {JSX.Element}
 */
export default function StoryNormalStyle({ postData, postContent }) {
  const {
    title = '',
    slug = '',
    sections = [],
    manualOrderOfSections = [],
    heroImage = null,
    heroVideo = null,
    heroCaption = '',
    publishedDate = '',
    updatedAt = '',
    writers = [],
    manualOrderOfWriters = [],
    photographers = [],
    camera_man = [],
    designers = [],
    engineers = [],
    vocals = [],
    extend_byline = '',
    tags = [],
    brief = { blocks: [], entityMap: {} },
    relateds = [],
    manualOrderOfRelateds = [],
  } = postData

  const [headerData, setHeaderData] = useState({
    sectionsData: [],
    topicsData: [],
  })
  const [isHeaderDataLoaded, setIsHeaderDataLoaded] = useState(false)
  const sectionsWithOrdered =
    manualOrderOfSections && manualOrderOfSections.length
      ? sortArrayWithOtherArrayId(sections, manualOrderOfSections)
      : sections
  const relatedsWithOrdered =
    manualOrderOfRelateds && manualOrderOfRelateds.length
      ? sortArrayWithOtherArrayId(relateds, manualOrderOfRelateds)
      : relateds

  const writersWithOrdered =
    manualOrderOfWriters && manualOrderOfWriters.length
      ? sortArrayWithOtherArrayId(writers, manualOrderOfWriters)
      : writers

  const [section] = sectionsWithOrdered

  /**
   * @returns {Promise<AsideArticleData[] | []>}
   */
  const handleFetchLatestNews = useCallback(async () => {
    try {
      /**
       * @type {import('@apollo/client').ApolloQueryResult<{posts: AsideArticleData[]}>}
       */
      const res = await client.query({
        query: fetchAsidePosts,
        variables: {
          take: 6,
          sectionSlug: section?.slug || 'news',
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
   * @returns {Promise<AsideArticleData[] | []>}
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
      return data.filter((data) => data).slice(0.6)
    } catch (err) {
      return []
    }
  }
  const credits = [
    { writers: writersWithOrdered },
    { photographers: photographers },
    { camera_man: camera_man },
    { designers: designers },
    { engineers: engineers },
    { vocals: vocals },
    { extend_byline: extend_byline },
  ]

  const publishedTaipeiTime = transformTimeDataIntoDotFormat(publishedDate)
  const updatedTaipeiTime = transformTimeDataIntoDotFormat(updatedAt)
  useEffect(() => {
    let ignore = false
    fetchHeaderDataInDefaultPageLayout()
      .then((res) => {
        if (!ignore && !isHeaderDataLoaded) {
          const { sectionsData, topicsData } = res
          setHeaderData({ sectionsData, topicsData })
          setIsHeaderDataLoaded(true)
        }
      })
      .catch((error) => {
        if (!ignore && !isHeaderDataLoaded) {
          console.log(
            errors.helpers.printAll(
              error,
              {
                withStack: true,
                withPayload: true,
              },
              0,
              0
            )
          )
          setIsHeaderDataLoaded(true)
        }
      })

    return () => {
      ignore = true
    }
  }, [isHeaderDataLoaded])
  return (
    <>
      {isHeaderDataLoaded ? (
        <ShareHeader
          pageLayoutType="default"
          headerData={{
            sectionsData: headerData.sectionsData,
            topicsData: headerData.topicsData,
          }}
        ></ShareHeader>
      ) : (
        <HeaderPlaceHolder />
      )}

      <PC_HD_Advertisement
        width="970px"
        height="250px"
        text="PC_HD 970*250"
      ></PC_HD_Advertisement>
      <Main>
        <Article>
          <SectionAndDate>
            <Section sectionSlug={section?.slug}>{section?.name || ''}</Section>
            <Date>{publishedTaipeiTime} 臺北時間</Date>
          </SectionAndDate>
          <Title>{title}</Title>
          <InfoAndHero>
            <StyledHeroImageAndVideo
              heroImage={heroImage}
              heroCaption={heroCaption}
              heroVideo={heroVideo}
              title={title}
            />
            <ArticleInfo
              updatedDate={updatedTaipeiTime}
              publishedDate={publishedTaipeiTime}
              credits={credits}
              tags={tags}
            ></ArticleInfo>
          </InfoAndHero>

          <ArticleBrief
            sectionSlug={section?.slug}
            brief={brief}
          ></ArticleBrief>
          <ArticleContent content={postContent} />
          <DateUnderContent>
            <span>更新時間｜</span>
            <span className="time">{updatedTaipeiTime} 臺北時間</span>
          </DateUnderContent>
          <DonateBanner />
          <SocialNetworkServiceSmall />
          <SubscribeInviteBanner />
          <RelatedArticleList relateds={relatedsWithOrdered} />
          <M_AT3_Advertisement
            text="M_AT3 336*280"
            width="336px"
            height="280px"
            className="ad"
          />
          <SocialNetworkServiceLarge
            shouldShowLargePagePlugin={true}
            flexDirection="column"
          />
          <M_AT3_Advertisement
            text="M_E1 336*280"
            width="336px"
            height="280px"
            className="ad"
          />
          <AdvertisementDableMobile>
            dable廣告(手機版)施工中......
            <DableAd isDesktop={false} />
          </AdvertisementDableMobile>
          <StoryEndDesktop>
            <StoryMoreInfo>
              更多內容，歡迎&nbsp;
              <Link href="/papermag" target="_blank">
                鏡週刊紙本雜誌
              </Link>
              、
              <Link href="/subscribe" target="_blank">
                鏡週刊數位訂閱
              </Link>
              、
              <Link href="/story/webauthorize/" target="_blank">
                了解內容授權資訊
              </Link>
              。
            </StoryMoreInfo>
            <MagazineInviteBanner />
            <AdvertisementDableDesktop>
              dable廣告 (桌機版) 施工中......
              <DableAd isDesktop={true} />
            </AdvertisementDableDesktop>
          </StoryEndDesktop>
        </Article>
        <Aside>
          <PC_R1_Advertisement
            text="PC_R1 300*600"
            width="300px"
            height="600px"
            className="ad"
          ></PC_R1_Advertisement>
          <AsideArticleList
            heading="最新文章"
            fetchArticle={handleFetchLatestNews}
            shouldReverseOrder={false}
            renderAmount={6}
          ></AsideArticleList>

          <PC_R2_Advertisement
            text="PC_R2 300*600"
            width="300px"
            height="600px"
            className="ad"
          ></PC_R2_Advertisement>
          <Divider />
          <AsideArticleList
            heading="熱門文章"
            fetchArticle={handleFetchPopularNews}
            shouldReverseOrder={false}
            renderAmount={6}
          ></AsideArticleList>
          <AsideFbPagePlugin></AsideFbPagePlugin>
        </Aside>
      </Main>
      <StoryEndMobileTablet>
        <StoryMoreInfo>
          更多內容，歡迎&nbsp;
          <Link href="/papermag" target="_blank">
            鏡週刊紙本雜誌
          </Link>
          、
          <Link href="/subscribe" target="_blank">
            鏡週刊數位訂閱
          </Link>
          、
          <Link href="/story/webauthorize/" target="_blank">
            了解內容授權資訊
          </Link>
          。
        </StoryMoreInfo>
        <MagazineInviteBanner />
        <AdvertisementDableDesktop>
          dable廣告 (桌機版) 施工中......
        </AdvertisementDableDesktop>
      </StoryEndMobileTablet>
    </>
  )
}
