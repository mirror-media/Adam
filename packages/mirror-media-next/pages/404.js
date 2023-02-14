import { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import Image from 'next/image'

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
  //fetch mock data for UI development, not for production
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios(
          'https://dev.mirrormedia.mg/json/popularlist.json'
        )
        setPosts(response?.data?.report)
      } catch (err) {
        console.error(err)
      }
    }
    fetchPost()
  }, [])

  const bullShitBrief =
    '我以為我了解早餐，但我真的了解早餐嗎？仔細想想，我對早餐的理解只是皮毛而已。由於，每個人的一生中，幾乎可說碰到早餐這件事，是必然會發生的。早餐的出現，必將帶領人類走向更高的巔峰。當你搞懂後就會明白了。世界上若沒有早餐，對於人類的改變可想而知。'

  return (
    <PageWrapper>
      <MsgContainer>
        <H1>404</H1>
        <Text>抱歉！找不到這個網址</Text>
      </MsgContainer>
      <Title>熱門會員文章</Title>
      <JoinMemberBtn>加入會員</JoinMemberBtn>
      <PostsContainer>
        {posts?.slice(0, 3).map((post, index) => {
          const imgUrl = post?.heroImage?.image?.resizedTargets?.desktop?.url
          const defaultImg = '/images/default-og-img.png'
          return (
            <PostCard key={index}>
              <a
                href={`${post?.slug}`}
                target="_blank"
                rel="noreferrer noopenner"
              >
                <PostWrapper>
                  <HeroImgWrapper>
                    <Image
                      src={imgUrl || defaultImg}
                      alt={post?.heroImage?.description}
                      width={323}
                      height={159}
                    />
                  </HeroImgWrapper>
                  <PostTitle className="post-title">{post?.title}</PostTitle>
                  <PostBrief>{bullShitBrief}</PostBrief>
                </PostWrapper>
              </a>
            </PostCard>
          )
        })}
      </PostsContainer>
    </PageWrapper>
  )
}
