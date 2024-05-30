//TODO: add component to add html head dynamically, not jus write head in every pag
import client from '../../apollo/apollo-client'
import { ENV, SITE_URL } from '../../config/index.mjs'
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
import {
  handleAxiosResponse,
  handleGqlResponse,
} from '../../utils/response-handle'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'

/**
 * @typedef {import('../../apollo/fragments/external').External} External
 */

/**
 *
 * @param {Object} props
 * @param {External} props.external
 * @param {Object} props.headerData
 * @returns {JSX.Element}
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
        }}
        header={{ type: 'default', data: headerData }}
        footer={{ type: 'default' }}
      >
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
  ])

  // handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    `Error occurs while getting header data in external post page (slug: ${slug})`,
    globalLogFields
  )

  /** @type {External} */
  const external = handleGqlResponse(
    responses[1],
    (gqlData) => {
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

  const props = {
    external,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
