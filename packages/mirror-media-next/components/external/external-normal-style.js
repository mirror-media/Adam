//TODO: adjust margin and padding of all margin and padding after implement advertisement.
//TODO: refactor jsx structure, make it more readable.
//TODO: adjust function `handleFetchPopularNews` and `handleFetchPopularNews`, make it more reuseable in other pages.

import { useCallback } from 'react'

import styled from 'styled-components'
import Link from 'next/link'
import axios from 'axios'
import dynamic from 'next/dynamic'
import ExternalArticleInfo from '../../components/external/external-article-info'
import ArticleBrief from '../../components/story/shared/brief'
import AsideArticleList from '../../components/story/normal/aside-article-list'
import FbPagePlugin from '../../components/story/normal/fb-page-plugin'
import SocialNetworkService from '../../components/story/normal/social-network-service'
import SubscribeInviteBanner from '../../components/story/normal/subscribe-invite-banner'
import DonateBanner from '../../components/story/shared/donate-banner'
import RelatedArticleList from '../../components/story/normal/related-article-list'
import MagazineInviteBanner from '../../components/story/shared/magazine-invite-banner'
import ExternalArticleContent from '../../components/external/external-article-content'
import ExternalHeroImage from '../../components/external/external-hero-image'
import Divider from '../../components/story/shared/divider'
import {
  transformTimeDataIntoDotFormat,
  getActiveOrderSection,
} from '../../utils'

import {
  URL_STATIC_POPULAR_NEWS,
  URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION,
  API_TIMEOUT,
} from '../../config/index.mjs'
import {
  transformStringToDraft,
  getExternalSectionTitle,
  getExternalPartnerColor,
} from '../../utils/external'
import { useDisplayAd } from '../../hooks/useDisplayAd'
import { Z_INDEX } from '../../constants/index'
import { getPageKeyByPartnerSlug } from '../../utils/ad'

const DableAd = dynamic(() => import('../ads/dable/dable-ad'), {
  ssr: false,
})

const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */
/**
 * @typedef {import('../story/normal/aside-article-list').ArticleData} AsideArticleData
 * @typedef {import('../story/normal/aside-article-list').ArticleDataContainSectionsWithOrdered} AsideArticleDataContainSectionsWithOrdered
 */
/**
 * @typedef {import('../../apollo/fragments/external').External} External
 */

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

const ExternalSection = styled.div`
  color: ${
    /**
     * @param {Object} props
     * @param {string | undefined} props.partnerColor
     */ ({ partnerColor }) => partnerColor || 'black'
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
         * @param {Object} props
         * @param {string | undefined} props.partnerColor
         */ ({ partnerColor }) => partnerColor || 'none'
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

const StyledExternalHeroImage = styled(ExternalHeroImage)``
const InfoAndHero = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoint.md} {
    ${StyledExternalHeroImage} {
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

const StyledGPTAd_HD = styled(GPTAd)`
  width: 100%;
  height: auto;
  max-width: 336px;
  max-height: 280px;
  margin: 20px auto 0px;

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 970px;
    max-height: 250px;
  }
`

//Because AT1, AT2, AT3 contain full-screen size ads content, should not set max-width and max-height

const StyledGPTAd_MB_AT3 = styled(GPTAd)`
  display: block;
  width: 100%;
  height: auto;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

const StyledGPTAd_MB_E1 = styled(GPTAd)`
  display: block;
  margin: 24px auto;
  width: 100%;
  height: auto;
  max-height: 280px;
  max-width: 336px;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
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
    max-height: 250px;
    max-width: 300px;
  }
`

const StyledGPTAd_PC_E2 = styled(GPTAd)`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    margin: 0;
    width: 100%;
    height: auto;
    max-height: 250px;
    max-width: 300px;
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

const StyledGPTAd_PC_R1 = styled(GPTAd)`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    width: 100%;
    height: auto;
    max-width: 300px;
    max-height: 600px;
    margin: 0 auto;
  }
`

const StyledGPTAd_PC_R2 = styled(GPTAd)`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    width: 100%;
    height: auto;
    max-width: 300px;
    max-height: 600px;
    margin: 20px auto;
  }
`

const StyledGPTAd_FT = styled(GPTAd)`
  width: 100%;
  height: auto;
  max-width: 336px;
  max-height: 280px;
  margin: 20px auto;

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 970px;
    max-height: 250px;
    margin: 35px auto;
  }
`

const StickyGPTAd_MB_ST = styled(GPTAd)`
  display: block;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  max-width: 320px;
  max-height: 50px;
  margin: auto;
  z-index: ${Z_INDEX.coverHeader};

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

/**
 *
 * @param {Object} props
 * @param {External} props.external
 * @returns {JSX.Element}
 */
export default function ExternalNormalStyle({ external }) {
  const {
    id = '',
    slug = '',
    title = '',
    thumb = '',
    brief = '',
    content = '',
    partner = null,
    publishedDate = '',
    updatedAt = '',
    extend_byline = '',
  } = external

  //Note: Although the `externals` post does not have `section` field, the default value for the external page is "news".
  const EXTERNAL_DEFAULT_SECTION = { name: '時事', slug: 'news' }

  //Note: The `heroImage` data in the `externals` post does not have `resized` property, only a single URL link. Here rewrite it into the format of "resized" for the "heroImage".
  const EXTERNAL_IMAGES_URL = {
    original: thumb,
    w480: '',
    w800: '',
    w1200: '',
    w1600: '',
    w2400: '',
  }

  const publishedTaipeiTime = transformTimeDataIntoDotFormat(publishedDate)
  const updatedTaipeiTime = transformTimeDataIntoDotFormat(updatedAt)

  const externalSectionTitle = getExternalSectionTitle(partner)
  const externalBrief = transformStringToDraft(id, brief)
  const partnerColor = getExternalPartnerColor(partner)

  /**
   * @returns {Promise<AsideArticleDataContainSectionsWithOrdered[] |[]>}
   */
  const handleFetchLatestNews = useCallback(async () => {
    try {
      /**
       * @type {import('@apollo/client').ApolloQueryResult<{posts: AsideArticleData[]}>}
       */
      const res = await axios({
        method: 'get',
        url: `${URL_STATIC_LATEST_NEWS_IN_CERTAIN_SECTION}/section_${EXTERNAL_DEFAULT_SECTION.slug}.json`,
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
  }, [slug, EXTERNAL_DEFAULT_SECTION.slug])

  /**
   * @returns {Promise<AsideArticleDataContainSectionsWithOrdered[] |[]>}
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

  const updatedTimeJsx = updatedTaipeiTime ? (
    <DateUnderContent>
      <span>更新時間｜</span>
      <span className="time">{updatedTaipeiTime} 臺北時間</span>
    </DateUnderContent>
  ) : null

  const shouldShowAd = useDisplayAd()

  return (
    <>
      {shouldShowAd && (
        <StyledGPTAd_HD
          pageKey={getPageKeyByPartnerSlug(partner.slug)}
          adKey="HD"
        />
      )}

      <Main>
        <Article>
          <SectionAndDate>
            <ExternalSection partnerColor={partnerColor}>
              {externalSectionTitle}
            </ExternalSection>
            <Date>{publishedTaipeiTime} 臺北時間</Date>
          </SectionAndDate>
          <Title>{title}</Title>
          <InfoAndHero>
            <StyledExternalHeroImage
              images={EXTERNAL_IMAGES_URL}
              title={title}
            />
            <ExternalArticleInfo
              updatedDate={updatedTaipeiTime}
              publishedDate={publishedTaipeiTime}
              credits={extend_byline}
            />
          </InfoAndHero>

          <ArticleBrief brief={externalBrief} />

          <ExternalArticleContent content={content} />

          {updatedTimeJsx}

          <DonateBanner />
          <SocialNetworkServiceSmall />
          <SubscribeInviteBanner />

          <RelatedArticleList relateds={[]} />

          {shouldShowAd && (
            <StyledGPTAd_MB_AT3
              pageKey={getPageKeyByPartnerSlug(partner.slug)}
              adKey="MB_AT3"
            />
          )}

          <SocialNetworkServiceLarge
            shouldShowLargePagePlugin={true}
            flexDirection="column"
          />

          {shouldShowAd && (
            <StyledGPTAd_MB_E1
              pageKey={getPageKeyByPartnerSlug(partner.slug)}
              adKey="MB_E1"
            />
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
                <StyledGPTAd_PC_E1
                  pageKey={getPageKeyByPartnerSlug(partner.slug)}
                  adKey="PC_E1"
                />
                <StyledGPTAd_PC_E2
                  pageKey={getPageKeyByPartnerSlug(partner.slug)}
                  adKey="PC_E2"
                />
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
            <StyledGPTAd_PC_R1
              pageKey={getPageKeyByPartnerSlug(partner.slug)}
              adKey="PC_R1"
            />
          )}

          <AsideArticleList
            listType={'latestNews'}
            fetchArticle={handleFetchLatestNews}
            shouldReverseOrder={false}
            renderAmount={6}
          />

          {shouldShowAd && (
            <StyledGPTAd_PC_R2
              pageKey={getPageKeyByPartnerSlug(partner.slug)}
              adKey="PC_R2"
            />
          )}

          <Divider />

          <AsideArticleList
            listType={'popularNews'}
            fetchArticle={handleFetchPopularNews}
            shouldReverseOrder={false}
            renderAmount={6}
          />

          <AsideFbPagePlugin />
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

      {shouldShowAd && (
        <>
          <StyledGPTAd_FT
            pageKey={getPageKeyByPartnerSlug(partner.slug)}
            adKey="FT"
          />
          <StickyGPTAd_MB_ST
            pageKey={getPageKeyByPartnerSlug(partner.slug)}
            adKey="MB_ST"
          />
        </>
      )}
    </>
  )
}
