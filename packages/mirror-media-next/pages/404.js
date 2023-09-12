import { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import Link from 'next/link'
import CustomImage from '@readr-media/react-image'
import { URL_STATIC_404_POPULAR_NEWS } from '../config/index.mjs'
import { API_TIMEOUT } from '../config/index.mjs'
import Layout from '../components/shared/layout'
import ShareHeader from '../components/shared/share-header'
import { HeaderSkeleton } from '../components/header'
import { fetchHeaderDataInDefaultPageLayout } from '../utils/api'
/** @typedef {import('../apollo/fragments/post').AsideListingPost & {brief: import('../apollo/fragments/post').Post['brief']} } ArticleDataWithBrief */
/**
 * @typedef {import('../components/shared/share-header').HeaderData} HeaderData
 */

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 46px;
`

const MsgContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #000000;
  width: 260px;
  padding: 58px 0;
`

const H1 = styled.h1`
  font-family: 'Helvetica Neue';
  font-weight: 400;
  font-size: 128px;
  line-height: 128px;
  color: #054f77;
`

const Text = styled.p`
  font-family: var(--notosansTC-font);
  font-size: 24px;
  color: #000000;
`

const Title = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  color: #054f77;
  padding: 28px 0 8px;

  ${({ theme }) => theme.breakpoint.xl} {
    font-weight: 700;
    font-size: 28px;
    padding: 41px 0 12px;
  }
`
const JoinMemberBtn = styled.button`
  width: 78px;
  height: 30px;
  left: 564px;
  top: 484px;
  background: #054f77;
  border-radius: 38px;
  color: #ffffff;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 12px;
  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: 16px;
  }

  :hover {
    cursor: pointer;
    background-color: #0d6b9e;
    transition: 0.1s ease-in;
  }

  :active {
    background-color: #ffffff;
    border: 1px solid #054f77;
    color: #054f77;
    transition: 0.1s ease-in;
  }

  :focus {
    outline: 0;
  }
`
const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.breakpoint.xl} {
    flex-direction: row;
  }
`
const PostCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 12px;

  :hover {
    cursor: pointer;

    .post-title {
      text-decoration: underline #4a4a4a 1.2px;
      text-underline-offset: 5px;
    }
  }

  ${({ theme }) => theme.breakpoint.xl} {
    :not(:last-child) {
      margin-right: 28px;
    }
  }
`
const HeroImgWrapper = styled.div`
  width: 284px;
  height: 139px;
  border-radius: 53px;
  overflow: hidden;

  ${({ theme }) => theme.breakpoint.xl} {
    width: 323px;
    height: 159px;
  }
`
const PostTitle = styled.p`
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
  color: #4a4a4a;
  width: 272px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  padding-top: 12px;
`
const PostBrief = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #9b9b9b;
  width: 272px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  padding-top: 8px;
`

const PostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default function Custom404() {
  /** @type {[ArticleDataWithBrief[],import('react').Dispatch<ArticleDataWithBrief[]>]} */
  const [popularNews, setPopularNews] = useState([])

  /** @type {[HeaderData,import('react').Dispatch<HeaderData>]} */
  const [headerData, setHeaderData] = useState(null)
  const [isHeaderDataLoaded, setIsHeaderDataLoaded] = useState(false)

  useEffect(() => {
    let ignore = false

    /**
     *
     * @returns {Promise<ArticleDataWithBrief[]>}
     */
    const fetchPopularNews = async () => {
      try {
        const { data } = await axios({
          method: 'get',
          url: URL_STATIC_404_POPULAR_NEWS,
          timeout: API_TIMEOUT,
        })

        return data
      } catch (err) {
        console.log(
          JSON.stringify({
            severity: 'WARNING',
            message: `Unable fetch popular news in 404 page`,
          })
        )
        return []
      }
    }
    fetchPopularNews().then((res) => {
      const firstThreePosts = res.slice(0, 3)
      if (!ignore) {
        setPopularNews(firstThreePosts)
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    /**
     * @returns {Promise<HeaderData>}
     */
    const fetchHeaderData = async () => {
      try {
        const data = await fetchHeaderDataInDefaultPageLayout()

        return data
      } catch (err) {
        console.log(
          JSON.stringify({
            severity: 'WARNING',
            message: `Unable fetch header data in 404 page`,
          })
        )
        return {
          sectionsData: [],
          topicsData: [],
        }
      }
    }
    fetchHeaderData().then((res) => {
      setHeaderData(res)
      setIsHeaderDataLoaded(true)
    })
  }, [])
  const shouldShowPopularNews = popularNews && popularNews.length > 0
  const popularNewsJsx = shouldShowPopularNews ? (
    <>
      {popularNews.map((post) => {
        const brief = post?.brief?.blocks?.[0]?.text
        return (
          <PostCard key={post.id}>
            <Link
              href={`/story/${post.slug}`}
              target="_blank"
              rel="noreferrer noopenner"
            >
              <PostWrapper>
                <HeroImgWrapper>
                  <CustomImage
                    loadingImage="/images/loading.gif"
                    defaultImage="/images/default-og-img.png"
                    images={post.heroImage?.resized}
                    imagesWebP={post.heroImage?.resizedWebp}
                    rwd={{
                      mobile: '284px',
                      tablet: '284px',
                      desktop: '323px',
                      default: '323px',
                    }}
                  />
                </HeroImgWrapper>
                <PostTitle className="post-title">{post.title}</PostTitle>
                <PostBrief>{brief}</PostBrief>
              </PostWrapper>
            </Link>
          </PostCard>
        )
      })}
    </>
  ) : null
  return (
    <Layout header={{ type: 'empty' }} footer={{ type: 'empty' }}>
      <>
        {isHeaderDataLoaded ? (
          <ShareHeader pageLayoutType="default" headerData={headerData} />
        ) : (
          <HeaderSkeleton />
        )}
        <PageWrapper>
          <MsgContainer>
            <H1>404</H1>
            <Text>抱歉！找不到這個網址</Text>
          </MsgContainer>
          <Title>熱門會員文章</Title>
          <Link href="/subscribe">
            <JoinMemberBtn>加入會員</JoinMemberBtn>
          </Link>
          <PostsContainer>{popularNewsJsx}</PostsContainer>
        </PageWrapper>
      </>
    </Layout>
  )
}
