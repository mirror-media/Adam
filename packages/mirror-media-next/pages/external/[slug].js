//TODO: add component to add html head dynamically, not jus write head in every pag
import client from '../../apollo/apollo-client'
import {
  API_TIMEOUT,
  ENV,
  SITE_URL,
  URL_STATIC_POST_FLASH_NEWS,
} from '../../config/index.mjs'
import { setPageCache } from '../../utils/cache-setting'
import { fetchExternalBySlug } from '../../apollo/query/externals'
import ExternalNormalStyle from '../../components/external/external-normal-style'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import Layout from '../../components/shared/layout'
import FullScreenAds from '../../components/ads/full-screen-ads'
import { useRouter } from 'next/router'
import Head from 'next/head'
import JsonLdsScripts from '../../components/externals/shared/json-lds-scripts'
import { getLogTraceObject } from '../../utils'
import { processSettledResult } from '../../utils/response-processor'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import dynamic from 'next/dynamic'
import axios from 'axios'
const MisoPageView = dynamic(() => import('../../components/miso-pageview'), {
  ssr: false,
})

/**
 * @typedef {import('../../apollo/fragments/external').External} External
 * @typedef {import('../../components/header/share-header').HeaderData} HeaderData
 * @typedef {import('../../components/header/shared/flash-news').FlashNews} FlashNews
 * @typedef {Record<'posts',FlashNews[]>} FlashNewsData
 * @typedef {import('axios').AxiosResponse<FlashNewsData>} FlashNewsAxiosResponse
 */

/**
 *
 * @param {Object} props
 * @param {External} props.external
 * @param {HeaderData} props.headerData
 * @returns {React.ReactNode}
 */
export default function External({ external, headerData }) {
  const router = useRouter()
  const { slug } = router.query
  const ampUrl = `https://${SITE_URL}/external/amp/${slug}`
  return (
    <>
      <Head>
        <meta
          property="dable:item_id"
          content={Array.isArray(slug) ? slug?.[0] : slug}
          key="dable:item_id"
        />
        <meta
          property="og:slug"
          content={Array.isArray(slug) ? slug?.[0] : slug}
          key="og:slug"
        />
        <link rel="amphtml" href={ampUrl} key="amphtml" />
      </Head>
      <JsonLdsScripts external={external} currentPage="/external/" />
      <Layout
        head={{
          title: `${external?.title}`,
          imageUrl: external?.thumb,
          pageType: 'external',
          pageSlug: `${slug}`,
        }}
        header={{
          type: 'default-with-flash-news',
          data: headerData,
        }}
        footer={{ type: 'default' }}
      >
        <MisoPageView productIds={`external_${slug}`} />
        <ExternalNormalStyle external={external} />
        <FullScreenAds />
      </Layout>
    </>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ params, req, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 300 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  const { slug } = params
  const globalLogFields = getLogTraceObject(req)

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(), //fetch header data
    client.query({
      query: fetchExternalBySlug,
      variables: { slug },
    }),
    axios({
      method: 'get',
      url: URL_STATIC_POST_FLASH_NEWS,
      timeout: API_TIMEOUT,
    }),
  ])

  // handle header data
  const [sectionsData, topicsData] = processSettledResult(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    `Error occurs while getting header data in external post page (slug: ${slug})`,
    globalLogFields
  )

  /** @type {External} */
  const external = processSettledResult(
    responses[1],
    (gqlData) => {
      console.log('gqlData', gqlData)
      if (!gqlData) {
        return {}
      } else {
        return gqlData.data?.externals[0] || {}
      }
    },
    `Error occurs while getting data in external post page (slug: ${slug})`,
    globalLogFields
  )

  if (!Object.keys(external).length) {
    return { notFound: true }
  }

  const flashNewsData = processSettledResult(
    responses[2],
    (/** @type {FlashNewsAxiosResponse} */ axiosData) => {
      return axiosData.data.posts ?? []
    },
    'Error occurs while getting flash news in external page',
    globalLogFields
  )
  const props = {
    external,
    headerData: { sectionsData, topicsData, flashNewsData },
  }

  return { props }
}
