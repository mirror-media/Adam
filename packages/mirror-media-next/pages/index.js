//TODO: will fetch topic data twice (once in header, once in index),
//should fetch only once by using Redux.
//TODO: add typedef of editor choice data
import React, { useMemo } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import {
  API_TIMEOUT,
  URL_STATIC_COMBO_TOPICS,
  URL_K3_FLASH_NEWS,
  URL_STATIC_POST_EXTERNALS_01,
} from '../config'

import FlashNews from '../components/flash-news'
import NavTopics from '../components/nav-topics'
import SubscribeMagazine from '../components/subscribe-magazine'
import EditorChoice from '../components/editor-choice'

const IndexContainer = styled.main`
  background-color: rgba(255, 255, 255, 1);
  max-width: 596px;

  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 1024px;
    height: 500vh;
  }
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
 * @param {import('../type/editor-choice.typedef').EditorChoiceRawData[] } [props.editorChoicesData=[]]
 * @returns {React.ReactElement}
 */
export default function Home({
  topicsData = [],
  flashNewsData = [],
  editorChoicesData = [],
}) {
  const flashNews = flashNewsData.map(({ slug, title }) => {
    return {
      title,
      slug,
      href: `/story/${slug}`,
    }
  })
  const editorChoice = editorChoicesData.map((article) => {
    const { slug = '', title = '', heroImage, sections } = article
    const [section] = sections
    const { mobile, tablet } = heroImage?.image?.resizedTargets || {}

    return {
      title,
      slug,
      href: `/story/${slug}`,
      imgSrc: tablet.url,
      imgSrcMobile: mobile.url,
      label: section.title || '',
      sectionName: section.name || '',
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
      <EditorChoice editorChoice={editorChoice}></EditorChoice>
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

//TODO: rename typedef, make it more clear
/**
 * @typedef {Object} PostRes
 * @property {string} timestamp
 * @property {Array} choices
 * @property {Array} latest
 */

/** @typedef {import('axios').AxiosResponse<DataRes>} AxiosResponse */

//TODO: rename typedef, make it more clear
/** @typedef {import('axios').AxiosResponse<PostRes>} AxiosPostResponse */

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
      axios({
        method: 'get',
        url: URL_STATIC_POST_EXTERNALS_01,
        timeout: API_TIMEOUT,
      }),
    ])

    /** @type {PromiseFulfilledResult<AxiosResponse>} */
    const topicsResponse = responses[0].status === 'fulfilled' && responses[0]
    /** @type {PromiseFulfilledResult<AxiosResponse>} */
    const flashNewsResponse =
      responses[1].status === 'fulfilled' && responses[1]

    /** @type {PromiseFulfilledResult<AxiosPostResponse>} */
    const postResponse = responses[2].status === 'fulfilled' && responses[2]
    console.log(postResponse)
    const topicsData = Array.isArray(
      topicsResponse?.value?.data?._endpoints?.topics?._items
    )
      ? topicsResponse?.value?.data?._endpoints?.topics?._items
      : []
    const flashNewsData = Array.isArray(flashNewsResponse.value?.data?._items)
      ? flashNewsResponse.value?.data?._items
      : []
    const editorChoicesData = Array.isArray(postResponse.value?.data?.choices)
      ? postResponse.value?.data?.choices
      : []

    console.log(
      JSON.stringify({
        severity: 'DEBUG',
        message: `Successfully fetch topics and flesh news from ${URL_STATIC_COMBO_TOPICS} and ${URL_K3_FLASH_NEWS}`,
      })
    )
    return {
      props: { topicsData, flashNewsData, editorChoicesData },
    }
  } catch (error) {
    console.log(JSON.stringify({ severity: 'ERROR', message: error.stack }))
    return {
      props: { topicsData: [], flashNewsData: [] },
    }
  }
}
