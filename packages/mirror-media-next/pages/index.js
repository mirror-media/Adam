//TODO: will fetch topic data twice (once in header, once in index),
//should fetch only once by using Redux.

import React, { useMemo } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import {
  API_TIMEOUT,
  URL_STATIC_COMBO_TOPICS,
  URL_K3_FLASH_NEWS,
} from '../config'

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
 * @param {import('../type').FlashNews[]} props.flashNewsData
 * @returns {React.ReactElement}
 */
export default function Home({ topicsData = [], flashNewsData = [] }) {
  const flashNews = flashNewsData.map(({ slug, title }) => {
    return {
      title,
      slug,
      href: `/story/${slug}`,
    }
  })
  const topics = useMemo(
    () => topicsData.filter((topic) => topic.isFeatured).slice(0, 9) ?? [],
    [topicsData]
  )

  return (
    <IndexContainer>
      <FlashNews flashNews={flashNews} />
      <IndexTop>
        <NavTopics topics={topics} />
        <SubscribeMagazine />
      </IndexTop>
    </IndexContainer>
  )
}

/**
 * @typedef {Object[]} Items
 */

/**
 * @typedef {Object} DataRes
 * @property {Object} [_endpoints]
 * @property {Object} [_endpoints.topics]
 * @property {Items} [_endpoints.topics._items]
 * @property {Items} [_items]
 * @property {Object} _links
 * @property {Object} _meta
 */

/** @typedef {import('axios').AxiosResponse<DataRes>} AxiosResponse */

export async function getServerSideProps() {
  try {
    const responses = await Promise.allSettled([
      axios({
        method: 'get',
        url: URL_STATIC_COMBO_TOPICS,
        timeout: API_TIMEOUT,
      }),
      axios({
        method: 'get',
        url: URL_K3_FLASH_NEWS,
        timeout: API_TIMEOUT,
      }),
    ])

    /** @type {PromiseFulfilledResult<AxiosResponse>} */
    const topicsResponse = responses[0].status === 'fulfilled' && responses[0]
    /** @type {PromiseFulfilledResult<AxiosResponse>} */
    const flashNewsResponse =
      responses[1].status === 'fulfilled' && responses[1]
    const topicsData = Array.isArray(
      topicsResponse?.value?.data?._endpoints?.topics?._items
    )
      ? topicsResponse?.value?.data?._endpoints?.topics?._items
      : []
    const flashNewsData = Array.isArray(flashNewsResponse.value?.data?._items)
      ? flashNewsResponse.value?.data?._items
      : []

    console.log(
      JSON.stringify({
        severity: 'DEBUG',
        message: `Successfully fetch topics and flesh news from ${URL_STATIC_COMBO_TOPICS} and ${URL_K3_FLASH_NEWS}`,
      })
    )
    return {
      props: { topicsData, flashNewsData },
    }
  } catch (error) {
    console.log(JSON.stringify({ severity: 'ERROR', message: error.stack }))
    return {
      props: { topicsData: [], flashNewsData: [] },
    }
  }
}
