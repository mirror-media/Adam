import client from '../../apollo/apollo-client'
import errors from '@twreporter/errors'
import styled, { css } from 'styled-components'
import MockAdvertisement from '../../components/mock-advertisement'
import Image from 'next/image'
import ArticleInfo from '../../components/story/normal/article-info'
import ArticleBrief from '../../components/story/normal/brief'
import { transformTimeDataIntoTaipeiTime } from '../../utils'
import GetPostBySlug from '../../apollo/query/get-post-by-slug.gql'

/**
 * @typedef {import('../../type/theme').Theme} Theme
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

const StoryMockAdvertisement = styled(MockAdvertisement)`
  margin: 24px auto;
  text-align: center;
  display: none;
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

const Aside = styled.aside`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    width: 365px;
    border: 1px solid black;
  }
`
/**
 *
 * @param {Object} props
 * @param {import('../../type/post.typedef').Post} props.postData
 * @returns
 */
export default function Story({ postData }) {
  const {
    title = '',
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
  } = postData

  const [section] = sections
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
      <StoryMockAdvertisement
        width="970px"
        height="250px"
        text="PC_HD 970*250"
      ></StoryMockAdvertisement>
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
        </Article>
        <Aside>這是側欄</Aside>
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
      query: GetPostBySlug,
      variables: { Slug: slug },
    })

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
