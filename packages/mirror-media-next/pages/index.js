//TODO: will fetch topic data twice (once in header, once in index),
//should fetch only once by using Redux.
//TODO: add typedef of editor choice data
import React, { useMemo } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import errors from '@twreporter/errors'
import client from '../apollo/apollo-client'
import { gql } from '@apollo/client'

import {
  API_TIMEOUT,
  URL_STATIC_COMBO_TOPICS,
  URL_K3_FLASH_NEWS,
  URL_STATIC_POST_EXTERNAL,
} from '../config'
import { transformRawDataToArticleInfo } from '../utils'
import FlashNews from '../components/flash-news'
import NavTopics from '../components/nav-topics'
import SubscribeMagazine from '../components/subscribe-magazine'
import EditorChoice from '../components/editor-choice'
import LatestNews from '../components/latest-news'
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
 * @param {import('../type/raw-data.typedef').RawData[] } [props.editorChoicesData=[]]
 * @param {import('../type/raw-data.typedef').RawData[] } [props.latestNewsData=[]]
 * @param {String} [props.latestNewsTimestamp]
 * @returns {React.ReactElement}
 */
export default function Home({
  topicsData = [],
  flashNewsData = [],
  editorChoicesData = [],
  latestNewsData = [],
  latestNewsTimestamp,
}) {
  const flashNews = flashNewsData.map(({ slug, title }) => {
    return {
      title,
      slug,
      href: `/story/${slug}`,
    }
  })
  const editorChoice = transformRawDataToArticleInfo(editorChoicesData)
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
      <LatestNews
        latestNewsData={latestNewsData}
        latestNewsTimestamp={latestNewsTimestamp}
      />
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
    const editorChoiceApollo = await client.query({
      query: gql`
        query GetEditorChoices {
          editorChoices(
            orderBy: { order: asc }
            where: {
              state: { equals: "published" }
              choices: { state: { equals: "published" } }
            }
          ) {
            id
            s
            order
            choices {
              id
              slug
              title
              subtitle
              state
              publishedDate
              sections {
                id
                name
              }
              categories {
                id
                name
              }
            }
          }
        }
      `,
    })
    console.log(editorChoiceApollo)
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
        url: `${URL_STATIC_POST_EXTERNAL}01.json`,
        timeout: API_TIMEOUT,
      }),
    ])

    responses.forEach((response) => {
      if (response.status === 'fulfilled') {
        console.log(
          JSON.stringify({
            severity: 'INFO',
            message: `Successfully fetch data on ${response.value.request.res.responseUrl}`,
          })
        )
      } else {
        const rejectedReason = response.reason
        const annotatingAxiosError =
          errors.helpers.annotateAxiosError(rejectedReason)
        console.error(
          JSON.stringify({
            severity: 'ERROR',
            message: errors.helpers.printAll(annotatingAxiosError, {
              withStack: true,
              withPayload: true,
            }),
          })
        )
      }
    })

    /** @type {PromiseFulfilledResult<AxiosResponse>} */
    const topicsResponse = responses[0].status === 'fulfilled' && responses[0]
    /** @type {PromiseFulfilledResult<AxiosResponse>} */
    const flashNewsResponse =
      responses[1].status === 'fulfilled' && responses[1]

    /** @type {PromiseFulfilledResult<AxiosPostResponse>} */
    const postResponse = responses[2].status === 'fulfilled' && responses[2]
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
    const latestNewsData = Array.isArray(postResponse.value?.data?.latest)
      ? postResponse.value?.data?.latest
      : []
    const latestNewsTimestamp = postResponse.value?.data?.timestamp

    return {
      props: {
        topicsData,
        flashNewsData,
        editorChoicesData,
        latestNewsData,
        latestNewsTimestamp,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while getting index page data'
    )

    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingError, {
          withStack: true,
          withPayload: false,
        }),
      })
    )
    return {
      props: {
        topicsData: [],
        flashNewsData: [],
        editorChoicesData: [],
        latestNewsData: [],
        latestNewsTimestamp: null,
      },
    }
  }
}
