import axios from 'axios'

import Header from '../../components/shared/mirror-media-header-old'
import { RedirectUrlContext } from '../../context/redirectUrl'
import {
  URL_STATIC_COMBO_SECTIONS,
  URL_MIRROR_MEDIA,
  API_TIMEOUT,
  API_PROTOCOL,
  API_HOST,
  API_PORT,
} from '../../config'
import SearchResult from '../../components/search-result'
import Footer from '../../components/shared/mirror-media-footer'
import { getSearchResult } from '../../utils/api/programmable-search'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

export default function Home({
  sectionsData,
  topicsData,
  searchResult,
  redirectUrl,
}) {
  return (
    <Wrapper>
      <RedirectUrlContext.Provider value={redirectUrl}>
        <Header sectionsData={sectionsData} topicsData={topicsData} />
        <SearchResult searchResult={searchResult} />
        <Footer />
      </RedirectUrlContext.Provider>
    </Wrapper>
  )
}

export async function getServerSideProps({ params }) {
  const searchTerms = params.searchTerms
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
      getSearchResult({
        exactTerms: searchTerms,
        start: 1,
      }),
    ])

    const props = {
      sectionsData: responses[0].value.data._items,
      topicsData: responses[1].value.data._endpoints.topics._items,
      searchResult: responses[2].value.data,
      redirectUrl: URL_MIRROR_MEDIA,
    }

    console.log(
      JSON.stringify({
        severity: 'DEBUG',
        message: `Successfully fetch sections and topics from ${URL_STATIC_COMBO_SECTIONS} and ${API_PROTOCOL}://${API_HOST}:${API_PORT}/combo?endpoint=topics`,
      })
    )
    return { props }
  } catch (error) {
    console.log(JSON.stringify({ severity: 'ERROR', message: error.stack }))
    return {
      props: {
        sectionsData: [],
        topicsData: [],
        searchResult: {},
        redirectUrl: URL_MIRROR_MEDIA,
      },
    }
  }
}
