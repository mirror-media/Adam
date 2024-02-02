//TODO: add component to add html head dynamically, not jus write head in every pag
import client from '../../apollo/apollo-client'
import errors from '@twreporter/errors'
import { GCP_PROJECT_ID, ENV } from '../../config/index.mjs'
import { setPageCache } from '../../utils/cache-setting'
import { fetchExternalBySlug } from '../../apollo/query/externals'
import ExternalNormalStyle from '../../components/external/external-normal-style'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import Layout from '../../components/shared/layout'
import FullScreenAds from '../../components/ads/full-screen-ads'
import { useRouter } from 'next/router'
import Head from 'next/head'
import JsonLdsScripts from '../../components/externals/shared/json-lds-scripts'

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
  const traceHeader = req.headers?.['x-cloud-trace-context']
  let globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
  }

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(), //fetch header data
    client.query({
      query: fetchExternalBySlug,
      variables: { slug },
    }),
  ])

  const handledResponses = responses.map((response) => {
    if (response.status === 'fulfilled') {
      return response.value
    } else if (response.status === 'rejected') {
      const { graphQLErrors, clientErrors, networkError } = response.reason
      const annotatingError = errors.helpers.wrap(
        response.reason,
        'UnhandledError',
        'Error occurs while getting section page data'
      )

      console.log(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(
            annotatingError,
            {
              withStack: true,
              withPayload: true,
            },
            0,
            0
          ),
          debugPayload: {
            graphQLErrors,
            clientErrors,
            networkError,
          },
          ...globalLogFields,
        })
      )
      return
    }
  })

  const headerData =
    'sectionsData' in handledResponses[0]
      ? handledResponses[0]
      : {
          sectionsData: [],
          topicsData: [],
        }
  const sectionsData = Array.isArray(headerData.sectionsData)
    ? headerData.sectionsData
    : []
  const topicsData = Array.isArray(headerData.topicsData)
    ? headerData.topicsData
    : []

  /** @type {External} */
  const external =
    'data' in handledResponses[1]
      ? handledResponses[1]?.data?.externals[0] || {}
      : {}

  if (!Object.keys(external).length) {
    return { notFound: true }
  }

  const props = {
    external,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
