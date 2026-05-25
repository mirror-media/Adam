import { ENV } from '../../config/index.mjs'
import { setPageCache } from '../../utils/cache-setting'
import { getLogTraceObject } from '../../utils'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { processSettledResult } from '../../utils/response-processor'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import Layout from '../../components/shared/layout'
import dynamic from 'next/dynamic'
const MisoSearch = dynamic(
  () => import('../../components/search/miso-search'),
  { ssr: false }
)
import { useEffect } from 'react'

/**
 * @typedef {Object} SearchResult
 * @property {string} searchTerms
 */

/**
 * @typedef {Object} SearchProps
 * @property {import('../../components/header/share-header').HeaderData} headerData
 * @property {SearchResult} searchResult
 */

/**
 * @param {SearchProps} props
 * @returns {React.ReactElement}
 */

export default function Search({ searchResult, headerData, testGroup }) {
  const searchTerms = searchResult?.searchTerms ?? ''

  // mounted 時寫入 GTM 變數層中
  useEffect(() => {
    const tagManagerArgs = {
      dataLayer: {
        event: 'pageview',
        page: {
          title: document.title,
          url: window.location.pathname,
          SearchResultPageVariable: testGroup,
        },
      },
    }
    import('react-gtm-module').then(({ default: TagManager }) => {
      TagManager.dataLayer(tagManagerArgs)
    })
  }, [testGroup])

  return (
    <Layout
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <MisoSearch searchTerms={searchTerms} />
    </Layout>
  )
}

export async function getServerSideProps({ req, res, params }) {
  const searchTerms = params.keyword ?? ''
  if (ENV === 'prod') {
    setPageCache(
      res,
      {
        cachePolicy: 'max-age',
        cacheTime: 600,
        sharedCacheTime: 600,
        staleWhileRevalidate: 3600,
      },
      req.url
    )
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  let globalLogFields = getLogTraceObject(req)

  let headerResponse
  ;[headerResponse] = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
  ])

  // handle header data
  const [sectionsData, topicsData] = processSettledResult(
    headerResponse,
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in search page',
    globalLogFields
  )

  const searchData = { searchTerms }

  const props = {
    searchResult: { searchTerms, items: searchData },
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
