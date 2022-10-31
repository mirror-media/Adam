import React from 'react'
import { GlobalStyles } from '../styles/global-styles'
import Layout from '../components/layout'
import axios from 'axios'
import {
  URL_STATIC_COMBO_SECTIONS,
  API_TIMEOUT,
  API_PROTOCOL,
  API_HOST,
  API_PORT,
} from '../config'

/**
 *
 * @param {Object} props
 * @param {React.ElementType} props.Component
 * @param {Object} props.pageProps
 * @param {Object[]} props.sectionsData
 * @param {Object[]} props.topicsData
 * @returns {React.ReactElement}
 */
function MyApp({ Component, pageProps, sectionsData = [], topicsData = [] }) {
  return (
    <>
      <GlobalStyles />
      <Layout sectionsData={sectionsData} topicsData={topicsData} />
      <Component {...pageProps} />
    </>
  )
}
/** @typedef {import('axios').AxiosResponse<{value: {data: Record<string, unknown>}}>} AxiosResponses */

/** @typedef {PromiseSettledResult<AxiosResponses>} SectionsData */

/** @typedef {PromiseSettledResult<AxiosResponses>} TopicsData */

/**
 * @async
 * @returns {Promise<{sectionsData: SectionsData | [] , topicsData:TopicsData | []}>}
 */
MyApp.getInitialProps = async () => {
  try {
    const responses = await Promise.allSettled([
      axios({
        method: 'get',
        url: URL_STATIC_COMBO_SECTIONS,
        timeout: API_TIMEOUT,
      }),
      axios({
        method: 'get',
        url: `${API_PROTOCOL}://${API_HOST}:${API_PORT}/combo?endpoint=topics`,
        timeout: API_TIMEOUT,
      }),
    ])

    const sectionsData =
      responses[0].status === 'fulfilled' &&
      Array.isArray(responses[0]?.value?.data?._items)
        ? responses[0]?.value?.data?._items
        : []

    const topicsData =
      responses[1].status === 'fulfilled' &&
      Array.isArray(responses[1]?.value?.data?._endpoints?.topics._items)
        ? responses[1]?.value?.data?._endpoints?.topics._items
        : []

    console.log(
      JSON.stringify({
        severity: 'DEBUG',
        message: `Successfully fetch sections and topics from ${URL_STATIC_COMBO_SECTIONS} and ${API_PROTOCOL}://${API_HOST}:${API_PORT}/combo?endpoint=topics`,
      })
    )
    return {
      sectionsData,
      topicsData,
    }
  } catch (error) {
    console.log(JSON.stringify({ severity: 'ERROR', message: error.stack }))
    return {
      sectionsData: [],
      topicsData: [],
    }
  }
}

export default MyApp
