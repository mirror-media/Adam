import { useCallback } from 'react'
import client from '../../apollo/apollo-client'
import errors from '@twreporter/errors'
import styled, { css } from 'styled-components'
import Link from 'next/link'
import MockAdvertisement from '../../components/mock-advertisement'
import Image from 'next/image'
import ArticleInfo from '../../components/story/normal/article-info'
import ArticleBrief from '../../components/story/normal/brief'
import AsideArticleList from '../../components/story/normal/aside-article-list'
import FbPagePlugin from '../../components/story/normal/fb-page-plugin'
import SocialNetworkService from '../../components/story/normal/social-network-service'
import SubscribeInviteBanner from '../../components/story/normal/subscribe-invite-banner'
import DonateBanner from '../../components/story/shared/donate-banner'
import MagazineInviteBanner from '../../components/story/shared/magazine-invite-banner'
import RelatedArticleList from '../../components/story/normal/related-article-list'
import { transformTimeDataIntoTaipeiTime } from '../../utils'
import { fetchListingPosts } from '../../apollo/query/posts'
import { fetchPostBySlug } from '../../apollo/query/post'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

/**
 * @typedef {import('../../components/story/normal/aside-article-list').ArticleData} AsideArticleData
 */

/**
 * @typedef {import('../../components/story/normal/article-info').Contacts} Contacts
 */

/**
 * @typedef {(import('../../apollo/query/post').Section &
 * { id: string, slug: string, name: string })[]} Sections
 */

/**
 * @typedef {import('../../apollo/query/post').HeroImage &
 * {
 *  id: string,
 *  resized: {
 *    original: string,
 *    w480: string,
 *    w800: string,
 *    w1200: string,
 *    w1600: string,
 *    w2400: string
 *  }
 * } } HeroImage
 */

/**
 * @typedef {import('../../apollo/query/post').HeroVideo & {
 * id: string, name:string, urlOriginal: string}} HeroVideo
 */

/**
 * @typedef {import('../../apollo/query/post').Draft} Draft
 */

/**
 * @typedef {(import('../../apollo/query/post').Related & {
 *  id: string, slug: string, title: string, heroImage: HeroImage})[]
 * } Relateds
 */

/**
 * @typedef {import('../../apollo/query/post').Post &
 * {
 * id: string,
 * slug: string,
 * title: string,
 * titleColor: "dark" | "light",
 * subtitle: string,
 * publishedDate: string,
 * updatedAt: string,
 * state: "published" | "draft" | "scheduled" | "archived" | "invisible",
 * sections: Sections | [],
 * writers: Contacts | [],
 * photographers: Contacts | [],
 * camera_man: Contacts | [],
 * designers: Contacts | [],
 * engineers: Contacts | [],
 * vocals: Contacts | [],
 * extend_byline: string,
 * tags: import('../../components/story/normal/article-info').Tags | [],
 * heroVideo : HeroVideo | null,
 * heroImage : HeroImage | null,
 * heroCaption: string,
 * brief: Draft,
 * content: Draft,
 * relateds: Relateds | []
 * } } PostData
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

const StoryContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  height: auto;
  max-width: 1200px;
`

const PC_HD_Advertisement = styled(MockAdvertisement)`
  display: none;
  margin: 24px auto;
  text-align: center;
`
const PC_R1_Advertisement = styled(MockAdvertisement)`
  margin: 0 auto;
  text-align: center;
`
const PC_R2_Advertisement = styled(MockAdvertisement)`
  margin: 20px auto;
  text-align: center;
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
  display: flex;
  justify-content: center;
  padding: 0 20px;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 0 64px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    padding: 0 40px 0 77px;
    justify-content: space-between;
  }
`
const Article = styled.article`
  width: 640px;
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

const HeroImage = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  margin: 20px 0 0;

  .caption {
    width: 100%;
    height: auto;
    margin-top: 9px;
    font-size: 18px;
    line-height: 25px;
    font-weight: 600;
    color: #9d9d9d;
  }
  ${({ theme }) => theme.breakpoint.md} {
    margin: 0;
  }
`
const InfoAndHero = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoint.md} {
    ${HeroImage} {
      order: 10;
    }
  }
`
const SocialNetworkServiceInArticle = styled(SocialNetworkService)`
  display: none;
  ${({ theme }) => theme.breakpoint.md} {
    display: flex;
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
  ${({ theme }) => theme.breakpoint.md} {
  }
  ${({ theme }) => theme.breakpoint.xl} {
  }
`

const StoryEnd = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 60px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 24px;
    gap: 16px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    gap: 36px;
    margin-top: 20px;
  }
`
const Aside = styled.aside`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
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

/**
 *
 * @param {Object} props
 * @param {PostData} props.postData
 * @returns {JSX.Element}
 */
export default function Story({ postData }) {
  const {
    title = '',
    slug = '',
    sections = [],
    publishedDate = '',
    updatedAt = '',
    writers = [],
    photographers = [],
    camera_man = [],
    designers = [],
    engineers = [],
    vocals = [],
    extend_byline = '',
    tags = [],
    brief = [],
    relateds = [],
  } = postData
  const [section] = sections

  /**
   * @returns {Promise<AsideArticleData[] | []>}
   */
  const handleFetchLatestNews = useCallback(async () => {
    try {
      /**
       * @type {import('@apollo/client').ApolloQueryResult<{posts: AsideArticleData[]}>}
       */
      const res = await client.query({
        query: fetchListingPosts,
        variables: {
          take: 6,
          sectionSlug: section.slug,
          storySlug: slug,
        },
      })
      return res.data?.posts
    } catch (err) {
      return []
    }
  }, [section, slug])

  const credits = [
    { writers: writers },
    { photographers: photographers },
    { camera_man: camera_man },
    { designers: designers },
    { engineers: engineers },
    { vocals: vocals },
    { extend_byline: extend_byline },
  ]
  const publishedTaipeiTime = transformTimeDataIntoTaipeiTime(publishedDate)
  const updatedTaipeiTime = transformTimeDataIntoTaipeiTime(updatedAt)

  return (
    <StoryContainer>
      <PC_HD_Advertisement
        width="970px"
        height="250px"
        text="PC_HD 970*250"
      ></PC_HD_Advertisement>
      <Main>
        <Article>
          <SectionAndDate>
            <Section sectionSlug={section?.slug}>{section?.name || ''}</Section>
            <Date>{publishedTaipeiTime}</Date>
          </SectionAndDate>
          <Title>{title}</Title>
          <InfoAndHero>
            <HeroImage>
              <Image
                src={
                  'https://storage.googleapis.com/static-mirrormedia-dev/images/20160929123258-7818228bd4c9933a170433e57a90616c-tablet.png'
                }
                width={640}
                height={427}
                alt="首圖"
              ></Image>
              <p className="caption">這是首圖圖說</p>
            </HeroImage>

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
          <DonateBanner />
          <SocialNetworkServiceInArticle />
          <SubscribeInviteBanner />
          <RelatedArticleList relateds={relateds} />
          <StoryEnd>
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
          </StoryEnd>
        </Article>
        <Aside>
          <PC_R1_Advertisement
            text="PC_R1 300*600"
            width="300px"
            height="600px"
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
          ></PC_R2_Advertisement>
          <AsideFbPagePlugin></AsideFbPagePlugin>
        </Aside>
      </Main>
    </StoryContainer>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ params }) {
  const { slug } = params
  try {
    const result = await client.query({
      query: fetchPostBySlug,
      variables: { slug },
    })
    /**
     * @type {PostData}
     */
    const postData = result?.data?.post
    if (!postData) {
      return { notFound: true }
    }

    return {
      props: {
        postData,
      },
    }
  } catch (err) {
    const { graphQLErrors, clientErrors, networkError } = err
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while getting index page data'
    )

    console.log(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(
          annotatingError,
          {
            withStack: true,
            withPayload: true,
          },
          0,
          0
        ),
        debugPayload: {
          graphQLErrors,
          clientErrors,
          networkError,
        },
      })
    )
    return { notFound: true }
  }
}
