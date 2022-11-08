//TODO: will fetch topic data twice (once in header, once in index),
//should fetch only once by using Redux.

import { useMemo } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { API_TIMEOUT, URL_STATIC_COMBO_TOPICS } from '../config'

const MOCK_DATA_FLASH_NEWS = [
  {
    slug: 'premium-test',
    title: 'premium-test',
    href: '/story/premium-test/',
  },
  {
    slug: '20180120soc001',
    title: '【吸金父子檔】這對父子太誇張　詐騙逾2億還「感謝上帝帶你進來」',
    href: '/story/20180120soc001/',
  },
  {
    slug: 'no-image',
    title: '沒有首圖的會員文章-aa',
    href: '/story/no-image/',
  },
  {
    slug: 'test-story-slug',
    title: 'Lighthouse 測試用文章',
    href: '/story/test-story-slug/',
  },
  {
    slug: '20191028ent006',
    title: '【網紅星勢力】唱歌拉二胡還不夠　許貝貝、小黛比陪聊留人',
    href: '/story/20191028ent006/',
  },
  {
    slug: '20201118fin001_test',
    title: '【理財最前線】捷運年底上路　台中北屯熱區買房攻略',
    href: '/story/20201118fin001_test/',
  },
  {
    slug: '20191125ent004',
    title: '【網紅星勢力】模特兒當到見血　J寶金嗓召喚陳零九',
    href: '/story/20191125ent004/',
  },
  {
    slug: 'oscar-test',
    title:
      '【奧斯卡90】完整得獎名單　《水底情深》奪4大獎：最佳影片、最佳導演、最佳原創配樂及最佳藝術指導',
    href: '/story/oscar-test/',
  },
  {
    slug: 'testvideotitle2',
    title: '測試影片與標題新格式',
    href: '/story/testvideotitle2/',
  },
  {
    slug: '20180129ent007',
    title: '【搶鏡頭】潔西卡瞎忙　那裡沒露還遮',
    href: '/story/20180129ent007/',
  },
]
import FlashNews from '../components/flash-news'
import NavTopics from '../components/nav-topics'
import SubscribeMagazine from '../components/subscribe-magazine'

const IndexContainer = styled.main`
  background-color: rgba(255, 255, 255, 1);
  max-width: 1200px;
  margin: 0 auto;
`

const IndexTop = styled.div`
  display: flex;
`

/**
 *
 * @param {Object} props
 * @param {import('../type').Topic[]} props.topicsData
 * @returns
 */
export default function Home({ topicsData = [] }) {
  const topics = useMemo(
    () => topicsData.filter((topic) => topic.isFeatured).slice(0, 9) ?? [],
    [topicsData]
  )

  return (
    <IndexContainer>
      <FlashNews flashNews={MOCK_DATA_FLASH_NEWS} />
      <IndexTop>
        <NavTopics topics={topics} />
        <SubscribeMagazine />
      </IndexTop>
    </IndexContainer>
  )
}

export async function getServerSideProps() {
  try {
    const responses = await axios({
      method: 'get',
      url: URL_STATIC_COMBO_TOPICS,
      timeout: API_TIMEOUT,
    })

    const topicsData = Array.isArray(
      responses?.data?._endpoints?.topics?._items
    )
      ? responses?.data?._endpoints?.topics?._items
      : []

    console.log(
      JSON.stringify({
        severity: 'DEBUG',
        message: `Successfully fetch topics from ${URL_STATIC_COMBO_TOPICS}`,
      })
    )
    return {
      props: { topicsData },
    }
  } catch (error) {
    console.log(JSON.stringify({ severity: 'ERROR', message: error.stack }))
    return {
      props: { topicsData: [] },
    }
  }
}
