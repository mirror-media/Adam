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
function MyApp({ Component, pageProps, sectionsData = [], topicsData = [] }) {
  return (
    <>
      <GlobalStyles />
      <Layout sectionsData={sectionsData} topicsData={topicsData} />
      <Component {...pageProps} />
    </>
  )
}
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

    console.log(responses[0].value.data._items)

    console.log(
      JSON.stringify({
        severity: 'DEBUG',
        message: `Successfully fetch sections and topics from ${URL_STATIC_COMBO_SECTIONS} and ${API_PROTOCOL}://${API_HOST}:${API_PORT}/combo?endpoint=topics`,
      })
    )
    return {
      sectionsData: responses[0].value.data._items,
      topicsData: responses[1].value.data._endpoints.topics._items,
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
