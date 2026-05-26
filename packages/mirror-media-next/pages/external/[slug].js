//TODO: add component to add html head dynamically, not jus write head in every pag
import client, { getStoryClient } from '../../apollo/apollo-client'
import {
  API_TIMEOUT,
  ENV,
  SITE_URL,
  URL_STATIC_POST_FLASH_NEWS,
  STORY_GQL_ENDPOINT,
} from '../../config/index.mjs'
import { setPageCache } from '../../utils/cache-setting'
import { fetchExternalBySlug } from '../../apollo/query/externals'
import generateJsonLdsData from '../../components/external/shared/json-lds-data'
import ExternalNormalStyle from '../../components/external/external-normal-style'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import Layout from '../../components/shared/layout'
import FullScreenAds from '../../components/ads/full-screen-ads'
import { useRouter } from 'next/router'
import Head from 'next/head'
import JsonLdsScript from '../../components/external/shared/json-lds-script'
import { getLogTraceObject } from '../../utils'
import { processSettledResult } from '../../utils/response-processor'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import dynamic from 'next/dynamic'
import { getRelatedStories } from '../../pages/api/recomemd'
import { useState, useEffect } from 'react'
import { toTaipeiISOString } from '../../utils/index'
import { formatMisoRelatedStories } from '../../utils/miso-related-stories.mjs'

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
 * @param {Object[]} props.jsonLdData
 * @returns {React.ReactNode}
 */

/**
 * Initializes and normalizes the related stories data.
 *
 * This function injects the route contract required by downstream related
 * article components. `external.relateds` points to internal story posts, so
 * each item should navigate to `/story/${item.slug}`.
 *
 * @param {Array} relateds - The raw related articles data from GraphQL
 * @returns {Array} - The normalized array with required fields
 */
const initializeRelatedStories = (relateds) => {
  return (relateds ?? []).map((item) => ({
    ...item,
    url: `/story/${item.slug}`,
    type: 'story',
  }))
}

export default function External({ external, headerData, jsonLdData }) {
  const router = useRouter()
  const { slug } = router.query
  const ampUrl = `https://${SITE_URL}/external/amp/${slug}`
  const [allRelatedStories, setAllRelatedStories] = useState(
    initializeRelatedStories(external.relateds)
  )

  const robots = 'index, max-image-preview:large'

  useEffect(() => {
    // Wait for page to be fully rendered before setting up miso API calls
    const setupScrollHandler = () => {
      const handleScroll = async () => {
        try {
          const result = await getRelatedStories(
            external.slug,
            [],
            10,
            'external'
          )

          if (result && result.data && result.data.products) {
            const formattedStories = formatMisoRelatedStories(
              result.data.products,
              {
                type: 'external',
              }
            )

            setAllRelatedStories((prev) => [...prev, ...formattedStories])
          }
        } catch (error) {
          console.error(
            'Failed to fetch MISO related external stories:',
            JSON.stringify(error)
          )
        }
      }

      window.addEventListener('scroll', handleScroll, { once: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }

    // Execute after page is fully loaded to avoid blocking TTFB
    if (document.readyState === 'complete') {
      // Page already loaded, setup immediately
      setupScrollHandler()
    } else {
      // Wait for page to finish loading
      window.addEventListener('load', setupScrollHandler, { once: true })
    }

    return () => {
      window.removeEventListener('load', setupScrollHandler)
    }
  }, [external.slug])

  const pubDate = (
    <meta
      name="pubdate"
      property="article:published_time"
      itemProp="datePublished"
      content={toTaipeiISOString(external?.publishedDate)}
      key="article:published_time"
    />
  )

  const lastMod = (
    <meta
      name="lastmod"
      property="article:modified_time"
      itemProp="dateModified"
      content={toTaipeiISOString(external?.updatedAt)}
      key="article:modified_time"
    />
  )

  const authorName = external?.partner?.name
    ? external?.partner.name
    : external?.extend_byline || ''

  return (
    <>
      <Head>
        <meta name="robots" content={robots} key="robots" />
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
        {external?.publishedDate && pubDate}
        {external?.updatedAt && lastMod}
        {authorName && (
          <>
            <meta name="author" content={authorName} key="author" />
            <meta
              property="article:author"
              content={authorName}
              key="article:author"
            />
          </>
        )}
        <meta
          name="publisher"
          itemProp="publisher"
          content="鏡週刊 Mirror Media"
          key="publisher"
        />
      </Head>
      <Layout
        head={{
          title: `${external?.title}`,
          imageUrl: external?.thumb,
          pageType: 'external',
          pageSlug: `${slug}`,
          description: external?.brief,
        }}
        header={{
          type: 'default-with-flash-news',
          data: headerData,
        }}
        footer={{ type: 'default' }}
      >
        <MisoPageView productIds={`external_${slug}`} />
        <ExternalNormalStyle
          external={external}
          allRelatedStories={allRelatedStories}
        />
        <FullScreenAds />
      </Layout>
      <JsonLdsScript jsonLdData={jsonLdData} />
    </>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ params, req, res }) {
  if (ENV === 'prod') {
    setPageCache(
      res,
      {
        cachePolicy: 'max-age',
        cacheTime: 300,
        sharedCacheTime: 300,
        staleWhileRevalidate: 3600,
      },
      req.url
    )
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  const { slug } = params
  const globalLogFields = getLogTraceObject(req)

  const fetchStaticJsonSafe = async (url, timeout) => {
    try {
      const mod = await import(
        '../../utils/server-side-only/fetch-static-json.js'
      )
      const res = await mod.fetchStaticJsonOnServer(url, timeout)
      return res
    } catch (err) {
      return null
    }
  }

  const externalClient = getStoryClient(STORY_GQL_ENDPOINT) || client

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(), //fetch header data
    externalClient.query({
      query: fetchExternalBySlug,
      variables: { slug },
    }),
    fetchStaticJsonSafe(URL_STATIC_POST_FLASH_NEWS, API_TIMEOUT, 'flash_news'),
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
      return axiosData?.data?.posts ?? []
    },
    'Error occurs while getting flash news in external page',
    globalLogFields
  )

  const jsonLdData = generateJsonLdsData(external, '/external/')

  const props = {
    external,
    headerData: { sectionsData, topicsData, flashNewsData },
    jsonLdData,
  }

  return { props }
}
