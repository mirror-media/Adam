//TODO: refactor jsx structure, make it more readable.
//TODO: adjust function `handleFetchPopularNews` and `handleFetchPopularNews`, make it more reuseable in other pages.

import { useCallback, useMemo, useState } from 'react'

import styled, { css } from 'styled-components'
import Link from 'next/link'
import axios from 'axios'
import dynamic from 'next/dynamic'
import ArticleInfo from '../../../components/story/normal/article-info'
import ArticleBrief from '../shared/brief'
import AsideArticleList from '../../../components/story/normal/aside-article-list'
import FbPagePlugin from '../../../components/story/normal/fb-page-plugin'
import SocialNetworkService from '../../../components/story/normal/social-network-service'
import SupportMirrorMediaBanner from '../shared/support-mirrormedia-banner'
import MagazineInviteBanner from '../../../components/story/shared/magazine-invite-banner'
import RelatedArticleList from '../../../components/story/normal/related-article-list'
import GPTFloatingAd from '../../../components/ads/gpt/gpt-floating-ad'
import ArticleContent from './article-content'
import HeroImageAndVideo from './hero-image-and-video'
import Divider from '../shared/divider'
import ShareHeader from '../../header/share-header'
import Footer from '../../shared/footer'
import GPTMbStAd from '../../ads/gpt/gpt-mb-st-ad'

import {
  transformTimeDataIntoDotFormat,
  getCategoryOfWineSlug,
} from '../../../utils'

import {
  URL_STATIC_POPULAR_NEWS,
  API_TIMEOUT,
  URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION,
} from '../../../config/index.mjs'
import { useDisplayAd } from '../../../hooks/useDisplayAd'
import { Z_INDEX } from '../../../constants/index'
import { getSectionGPTPageKey } from '../../../utils/ad'
import { getActiveOrderSection, getActiveOrderCategory } from '../../../utils'
import GPT_Placeholder from '../../ads/gpt/gpt-placeholder'

const DableAd = dynamic(() => import('../../ads/dable/dable-ad'), {
  ssr: false,
})

const GPTAd = dynamic(() => import('../../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

/**
 * @typedef {import('../../../components/story/normal/aside-article-list').ArticleData} AsideArticleData
 * @typedef {import('../../../components/story/normal/aside-article-list').ArticleDataContainSectionsWithOrdered} AsideArticleDataContainSectionsWithOrdered
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
 * @typedef {Object} PostContent
 * @property {'fullContent' | 'trimmedContent'} type
 * @property {Pick<PostData,'content'>['content']} data
 * @property {boolean} isLoaded
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

const SubTitle = styled.h2`
  margin: 0 auto;
  width: 100%;
  text-align: center;
  font-weight: 500;
  font-size: 24px;
  line-height: 34px;
  font-size: 20px;
  color: rgba(113, 113, 113, 0.87);
  font-feature-settings: 'clig' off, 'liga' off;
  line-height: normal;
  margin-top: 0.5rem;
  ${({ theme }) => theme.breakpoint.md} {
    color: #717171;
    font-size: 28px;
    font-weight: 400;
    line-height: 140%;
    text-align: start;
  }
`

const Main = styled.main`
  margin: 20px auto 0;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  position: relative;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 64px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 24px auto 0;
    display: flex;
    flex-direction: row;

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
      background-color: ${
        /**
         * @param {{ sectionSlug: String}} props
         */
        ({ sectionSlug }) => sectionSlug && sectionColor
      };
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

const FixedContainer = styled.div`
  ${({ theme }) => theme.breakpoint.xl} {
    position: sticky;
    width: 365px;
    top: 32px;
    right: 0;
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
const DableADContainer_Desktop = styled.div`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    width: 100%;
    height: auto;
    max-width: 640px;
    margin: 0 auto;
  }
`
const DableADContainer_Mobile = styled.div`
  display: block;
  margin: 0 auto;
  width: 100%;
  height: auto;
  max-width: 640px;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const StyledGPTAd_HD = styled(GPTAd)`
  width: 100%;
  height: auto;
`
//Because AT1, AT2, AT3 contain full-screen size ads content, should not set max-width and max-height
const StyledGPTAd_MB_AT3 = styled(GPTAd)`
  display: block;
  margin: 0 -20px;
  width: 100%;
  height: auto;

  @media (min-width: 336px) {
    margin: 0 auto;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const StyledGPTAd_MB_E1 = styled(GPTAd)`
  display: block;
  margin: 24px auto;
  width: 100%;
  height: auto;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const StyledGPTAd_PC_R1 = styled(GPTAd)`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    width: 100%;
    height: auto;
    margin: 0 auto;
  }
`
const StyledGPTAd_PC_R2 = styled(GPTAd)`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    width: 100%;
    height: auto;
    margin: 20px auto;
  }
`

const StyledGPTAd_FT = styled(GPTAd)`
  width: 100%;
  height: auto;
  margin: 20px auto;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 35px auto;
  }
`

const StickyGPTAd_MB_ST = styled(GPTMbStAd)`
  display: block;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  margin: auto;
  z-index: ${Z_INDEX.coverHeader};

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const GPTAdContainer = styled.div`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    margin: auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`
const StyledGPTAd_PC_E1 = styled(GPTAd)`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    margin: 0;
    width: 100%;
    height: auto;
  }
`

const StyledGPTAd_PC_E2 = styled(GPTAd)`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    margin: 0;
    width: 100%;
    height: auto;
  }
`

/**
 *
 * @param {Object} param
 * @param {PostData} param.postData
 * @param {PostContent} param.postContent
 * @param {any} param.headerData
 * @param {string} [param.classNameForGTM]
 * @returns {JSX.Element}
 */
export default function StoryNormalStyle({
  postData,
  postContent,
  headerData,
  classNameForGTM = '',
}) {
  const [isHDAdEmpty, setISHDAdEmpty] = useState(true)
  const {
    title = '',
    subtitle = '',
    slug = '',
    sections = [],
    categories = [],
    sectionsInInputOrder = [],
    categoriesInInputOrder = [],
    heroImage = null,
    heroVideo = null,
    heroCaption = '',
    publishedDate = '',
    updatedAt = '',
    writers = [],
    writersInInputOrder = [],
    photographers = [],
    camera_man = [],
    designers = [],
    engineers = [],
    vocals = [],
    extend_byline = '',
    tags = [],
    brief = { blocks: [], entityMap: {} },
    relateds = [],
    relatedsInInputOrder = [],
    hiddenAdvertised = false,
  } = postData

  const sectionsWithOrdered = getActiveOrderSection(
    sections,
    sectionsInInputOrder
  )

  const relatedsWithOrdered =
    relatedsInInputOrder && relatedsInInputOrder.length
      ? relatedsInInputOrder
      : relateds

  const writersWithOrdered =
    writersInInputOrder && writersInInputOrder.length
      ? writersInInputOrder
      : writers

  const [section] = sectionsWithOrdered

  const pageKeyForGptAd = getSectionGPTPageKey(section?.slug)

  /**
   * @returns {Promise<AsideArticleDataContainSectionsWithOrdered[] | []>}
   */
  const handleFetchLatestNews = useCallback(async () => {
    try {
      /**
       * @type {import('@apollo/client').ApolloQueryResult<{posts: AsideArticleData[]}>}
       */
      const res = await axios({
        method: 'get',
        url: `${URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION}/section_${
          section?.slug || 'news'
        }.json`,
        timeout: API_TIMEOUT,
      })
      return res.data?.posts
        .filter((post) => post.slug !== slug)
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
  }, [slug, section?.slug])

  /**
   * @returns {Promise<AsideArticleDataContainSectionsWithOrdered[] | []>}
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
  const credits = [
    { writers: writersWithOrdered },
    { photographers: photographers },
    { camera_man: camera_man },
    { designers: designers },
    { engineers: engineers },
    { vocals: vocals },
    { extend_byline: extend_byline },
  ]

  // 如無大分區section，但有分類category，文內的頁籤顯示category
  const tagBeforeTitle = useMemo(() => {
    if (section) return section
    const categoriesWithOrdered = getActiveOrderCategory(
      categories,
      categoriesInInputOrder
    )
    const [category] = categoriesWithOrdered
    if (!category) return {}
    return {
      name: category.name,
      slug: category.sections?.[0]?.slug || 'none',
    }
  }, [section, categories, categoriesInInputOrder])

  const publishedTaipeiTime = transformTimeDataIntoDotFormat(publishedDate)
  const updatedTaipeiTime = transformTimeDataIntoDotFormat(updatedAt)

  const shouldShowAd = useDisplayAd(hiddenAdvertised)
  //If no wine category, then should show gpt ST ad, otherwise, then should not show gpt ST ad.
  const noCategoryOfWineSlug = getCategoryOfWineSlug(categories).length === 0

  const handleObSlotRenderEnded = useCallback((e) => {
    setISHDAdEmpty(e.isEmpty)
  }, [])

  return (
    <>
      <ShareHeader
        pageLayoutType="default"
        headerData={{
          sectionsData: headerData?.sectionsData,
          topicsData: headerData?.topicsData,
        }}
      />

      <GPT_Placeholder shouldTranslate={!shouldShowAd || isHDAdEmpty}>
        {shouldShowAd && (
          <StyledGPTAd_HD
            pageKey={pageKeyForGptAd}
            adKey="HD"
            onSlotRenderEnded={handleObSlotRenderEnded}
          />
        )}
      </GPT_Placeholder>

      <Main className={classNameForGTM}>
        <Article>
          <SectionAndDate>
            {/* hide section for advertised article but remain the same architecture*/}
            {postData.isAdvertised ? (
              <div />
            ) : (
              <Section sectionSlug={tagBeforeTitle?.slug}>
                {tagBeforeTitle?.name || ''}
              </Section>
            )}
            <Date>{publishedTaipeiTime} 臺北時間</Date>
          </SectionAndDate>
          <Title>{title}</Title>
          {!!subtitle && <SubTitle>{subtitle}</SubTitle>}
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
            />
          </InfoAndHero>
          <ArticleBrief sectionSlug={section?.slug} brief={brief} />
          <ArticleContent
            content={postContent.data}
            hiddenAdvertised={hiddenAdvertised}
            pageKeyForGptAd={pageKeyForGptAd}
          />
          <DateUnderContent>
            <span>更新時間｜</span>
            <span className="time">{updatedTaipeiTime} 臺北時間</span>
          </DateUnderContent>
          <SupportMirrorMediaBanner />
          <SocialNetworkServiceSmall />
          <RelatedArticleList
            relateds={relatedsWithOrdered}
            hiddenAdvertised={hiddenAdvertised}
          />
          {shouldShowAd && (
            <StyledGPTAd_MB_AT3 pageKey={pageKeyForGptAd} adKey="MB_AT3" />
          )}
          <SocialNetworkServiceLarge
            shouldShowLargePagePlugin={true}
            flexDirection="column"
          />
          {shouldShowAd && (
            <StyledGPTAd_MB_E1 pageKey={pageKeyForGptAd} adKey="MB_E1" />
          )}
          {shouldShowAd && section?.slug === 'carandwatch' && (
            <GPTFloatingAd pageKey={pageKeyForGptAd} />
          )}
          {shouldShowAd && (
            <DableADContainer_Mobile>
              <DableAd isDesktop={false} />
            </DableADContainer_Mobile>
          )}
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

            {shouldShowAd && (
              <GPTAdContainer>
                <StyledGPTAd_PC_E1 pageKey={pageKeyForGptAd} adKey="PC_E1" />
                <StyledGPTAd_PC_E2 pageKey={pageKeyForGptAd} adKey="PC_E2" />
              </GPTAdContainer>
            )}

            {shouldShowAd && (
              <DableADContainer_Desktop>
                <DableAd isDesktop={true} />
              </DableADContainer_Desktop>
            )}
          </StoryEndDesktop>
        </Article>
        <Aside>
          {shouldShowAd && (
            <StyledGPTAd_PC_R1 pageKey={pageKeyForGptAd} adKey="PC_R1" />
          )}
          <AsideArticleList
            listType={'latestNews'}
            fetchArticle={handleFetchLatestNews}
            shouldReverseOrder={false}
            renderAmount={6}
          />
          <FixedContainer>
            {shouldShowAd && (
              <StyledGPTAd_PC_R2 pageKey={pageKeyForGptAd} adKey="PC_R2" />
            )}

            <Divider />
            <AsideArticleList
              listType={'popularNews'}
              fetchArticle={handleFetchPopularNews}
              shouldReverseOrder={false}
              renderAmount={6}
              hiddenAdvertised={hiddenAdvertised}
            />
            <AsideFbPagePlugin />
          </FixedContainer>
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

        {shouldShowAd && (
          <DableADContainer_Desktop>
            <DableAd isDesktop={true} />
          </DableADContainer_Desktop>
        )}
      </StoryEndMobileTablet>

      {shouldShowAd && <StyledGPTAd_FT pageKey={pageKeyForGptAd} adKey="FT" />}

      {shouldShowAd && noCategoryOfWineSlug ? (
        <StickyGPTAd_MB_ST pageKey={pageKeyForGptAd} />
      ) : null}
      <Footer footerType="default" />
    </>
  )
}
