// import client from '../../apollo/apollo-client'
// import { gql } from '@apollo/client'
import errors from '@twreporter/errors'
import styled, { css } from 'styled-components'
import MockAdvertisement from '../../components/mock-advertisement'
import Image from 'next/image'
import ArticleInfo from '../../components/story/normal/article-info'
import ArticleBrief from '../../components/story/normal/brief'
const MOCK_DATA_STORY = {
  '20221214edi004': {
    data: {
      post: {
        id: '195055',
        slug: '20221214edi004',
        title: '【2022世足】阿根廷3比0完封克羅埃西亞　梅西1進球1助攻再闖冠軍賽',
        titleColor: 'light',
        subtitle: '這是副標',
        publishedDate: '2022-12-14T01:41:40.000Z',
        updatedAt: '2023-01-10T08:18:56.455Z',
        sections: [
          {
            id: '32',
            name: '時事',
            slug: 'news',
          },
          {
            id: '33',
            name: '娛樂',
            slug: 'entertainment',
          },
          {
            id: '36',
            name: '文化',
            slug: 'culture',
          },
        ],
        writers: [
          {
            id: '113',
            name: '鄒念祖',
          },
          {
            id: '121',
            name: '王錦華',
          },
          {
            id: '117',
            name: '簡竹書',
          },
          {
            id: '496',
            name: '林高',
          },
        ],
        photographers: [],
        camera_man: [
          {
            id: '114',
            name: '劉慧茹',
          },
          {
            id: '113',
            name: '鄒念祖',
          },
        ],
        designers: [
          {
            id: '121',
            name: '王錦華',
          },
          {
            id: '115',
            name: '廖佩玲',
          },
        ],
        engineers: [
          {
            id: '115',
            name: '廖佩玲',
          },
          {
            id: '116',
            name: '翁瑞怡',
          },
          {
            id: '120',
            name: '黃文鉅',
          },
        ],
        vocals: [
          {
            id: '117',
            name: '簡竹書',
          },
          {
            id: '115',
            name: '廖佩玲',
          },
          {
            id: '120',
            name: '黃文鉅',
          },
        ],
        extend_byline:
          '陳小花、織田信長、李奧納多·狄卡皮歐、Katherine Matilda Swinton',
        tags: [
          {
            id: '25882',
            name: '阿根廷',
          },
          {
            id: '26154',
            name: '世足',
          },
          {
            id: '15557',
            name: '克羅埃西亞',
          },
          {
            id: '7412',
            name: '梅西',
          },
        ],
        heroVideo: null,
        heroImage: {
          id: '9755',
          name: '',
          resized: {
            original:
              'https://storage.googleapis.com/static-mirrormedia-dev/images/20160929123258-7818228bd4c9933a170433e57a90616c.png',
            w480: 'https://storage.googleapis.com/static-mirrormedia-dev/images/20160929123258-7818228bd4c9933a170433e57a90616c-w480.png',
            w800: 'https://storage.googleapis.com/static-mirrormedia-dev/images/20160929123258-7818228bd4c9933a170433e57a90616c-w800.png',
            w1200: '',
            w1600:
              'https://storage.googleapis.com/static-mirrormedia-dev/images/20160929123258-7818228bd4c9933a170433e57a90616c-w1600.png',
            w2400:
              'https://storage.googleapis.com/static-mirrormedia-dev/images/20160929123258-7818228bd4c9933a170433e57a90616c-w2400.png',
          },
        },
        heroCaption: '梅西與小將艾瓦雷茲攜手將阿根廷送進冠軍賽。（東方IC）',
        brief: {
          blocks: [
            {
              key: '3teck',
              data: {},
              text: '',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
            {
              key: '7f1kt',
              data: {},
              text: 'h2',
              type: 'header-two',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
            {
              key: 'ms15',
              data: {},
              text: '',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
            {
              key: '7p20l',
              data: {},
              text: '2022卡達世足今（14日）凌晨4強戰開踢，南美勁旅阿根廷終場以3比0大勝克羅埃西亞，當家球星梅西（Lionel Messi）踢進一顆12碼點球並傳出一次助攻，小將艾瓦雷茲（Julian Alvarez）更是梅開二度，老少配攜手率領潘帕斯雄鷹挺進冠軍賽。',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
            {
              key: '2j92a',
              data: {},
              text: '',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
            {
              key: '76p65',
              data: {},
              text: '粗體Bold粗體Bold粗體Bold粗體Bold粗體Bold粗體Bold粗體Bold粗體Bold粗體Bold粗體Bold粗體Bold粗體Bold粗體Bold粗體Bold粗體Bold粗體Bold',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [
                {
                  style: 'BOLD',
                  length: 96,
                  offset: 0,
                },
              ],
            },
            {
              key: 'cmq26',
              data: {},
              text: '',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
            {
              key: '5gnao',
              data: {},
              text: '斜體italics斜體italics斜體italics斜體italics斜體italics斜體italics斜體italics斜體italics斜體italics斜體italics斜體italics斜體italics斜體italics斜體italics斜體italics斜體italics',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [
                {
                  style: 'ITALIC',
                  length: 144,
                  offset: 0,
                },
              ],
            },
            {
              key: '3un4o',
              data: {},
              text: '',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
            {
              key: '1io97',
              data: {},
              text: '底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline底線Underline',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [
                {
                  style: 'UNDERLINE',
                  length: 242,
                  offset: 0,
                },
              ],
            },
            {
              key: '1uh6h',
              data: {},
              text: '',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
            {
              key: '4sdac',
              data: {},
              text: '程式碼inline程式碼inline程式碼inline程式碼inline程式碼inline程式碼inline程式碼inline程式碼inline程式碼inline程式碼inline程式碼inline程式碼inline程式碼inline程式碼inline程式碼inline程式碼inline',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [
                {
                  style: 'CODE',
                  length: 144,
                  offset: 0,
                },
              ],
            },
            {
              key: '3mi8j',
              data: {},
              text: '',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
            {
              key: '3qka6',
              data: {},
              text: '超連結1',
              type: 'unstyled',
              depth: 0,
              entityRanges: [
                {
                  key: 0,
                  length: 4,
                  offset: 0,
                },
              ],
              inlineStyleRanges: [],
            },
            {
              key: 'fs6s7',
              data: {},
              text: '超連結2',
              type: 'unstyled',
              depth: 0,
              entityRanges: [
                {
                  key: 1,
                  length: 4,
                  offset: 0,
                },
              ],
              inlineStyleRanges: [],
            },
            {
              key: 'cm1e3',
              data: {},
              text: '',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
            {
              key: '95g1p',
              data: {},
              text: '',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
          ],
          entityMap: {
            0: {
              data: {
                url: 'https://www.google.com',
              },
              type: 'LINK',
              mutability: 'MUTABLE',
            },
            1: {
              data: {
                url: 'https://www.mirrormedia.mg',
              },
              type: 'LINK',
              mutability: 'MUTABLE',
            },
          },
        },
        content: {
          blocks: [
            {
              key: '1hd0',
              data: {},
              text: '雙方開賽並未有太多攻勢，儘管格子軍維持傳控打法，多數時間將球掌控在腳下，仍無法有效突破阿根廷的後防，幾乎沒有射門機會。比賽31分鐘，阿根廷抓緊機會反攻，艾瓦雷茲接獲傳球後在對手門前起腳，可惜被克羅埃西亞門將利瓦科維奇（Dominik Livakovic）絆倒，卻也獲得一次12碼罰球機會，小獅王梅西頂住壓力順利破網，為阿根廷先馳得點。',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
            {
              key: '744gh',
              data: {},
              text: '5分鐘後又是兩人的配合，艾瓦雷茲在中線接獲梅西傳球後，一路帶球衝向球門推進，禁區內3人包夾下搶在格子軍門將撲救前替阿根廷再下1分，帶著2比0進入下半場。',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
            {
              key: 'c08s7',
              data: {},
              text: '下半場克羅埃西亞幾次調度想扳回分數，無奈進攻依舊沒有起色，阿根廷在比賽69分鐘再度上演防守反擊，梅西再度展現球王等級的腳法，在對手貼身看防下從右邊邊路殺到禁區，轉身過人後在門前一記妙傳助攻，後插上的艾瓦雷茲也把握機會梅開二度，將比數擴大到3比0。最後阿根廷繼2014年巴西世足後再闖冠軍賽。1',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
          ],
          entityMap: {},
        },
      },
    },
  },
}

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

export default function Story({ storyData }) {
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
  } = storyData

  const [section] = sections
  const credits = [
    { 文: writers },
    { 攝影: photographers },
    { 影音: camera_man },
    { 設計: designers },
    { 工程: engineers },
    { 主播: vocals },
    { 特約記者: extend_byline },
  ]

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
            <Section sectionSlug={section.slug}>{section.name || ''}</Section>
            <Date>{publishedDate}</Date>
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
              updatedDate={updatedAt}
              publishedDate={publishedDate}
              credits={credits}
              tags={tags}
            ></ArticleInfo>
          </InfoAndHero>
          <ArticleBrief sectionSlug={section.slug} brief={brief}></ArticleBrief>
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
    const result = MOCK_DATA_STORY[slug]
    const storyData = result?.data?.post
    if (!result || !storyData) {
      throw new Error()
    }
    return {
      props: {
        storyData,
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
