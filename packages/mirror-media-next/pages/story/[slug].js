// import client from '../../apollo/apollo-client'
// import { gql } from '@apollo/client'
import errors from '@twreporter/errors'
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
        sections: [
          {
            id: '32',
            name: '時事',
          },
          {
            id: '33',
            name: '娛樂',
          },
          {
            id: '36',
            name: '文化',
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
        photographers: [
          {
            id: '114',
            name: '劉慧茹',
          },
        ],
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
              text: '2022卡達世足今（14日）凌晨4強戰開踢，南美勁旅阿根廷終場以3比0大勝克羅埃西亞，當家球星梅西（Lionel Messi）踢進一顆12碼點球並傳出一次助攻，小將艾瓦雷茲（Julian Alvarez）更是梅開二度，老少配攜手率領潘帕斯雄鷹挺進冠軍賽。',
              type: 'unstyled',
              depth: 0,
              entityRanges: [],
              inlineStyleRanges: [],
            },
          ],
          entityMap: {},
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

export default function Story({ storyData }) {
  return <div>這是story頁{JSON.stringify(storyData)}</div>
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
