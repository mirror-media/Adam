//TODO: add component to add html head dynamically, not jus write head in every pag
import client from '../../../apollo/apollo-client'
import errors from '@twreporter/errors'
import {
  GCP_PROJECT_ID,
  ENV,
  SITE_URL,
  GA_MEASUREMENT_ID,
} from '../../../config/index.mjs'
import { setPageCache } from '../../../utils/cache-setting'
import { fetchExternalBySlug } from '../../../apollo/query/externals'
import Layout from '../../../components/shared/layout'
import Head from 'next/head'
import styled from 'styled-components'
import AmpHeader from '../../../components/amp/amp-header'
import AmpGptAd from '../../../components/amp/amp-ads/amp-gpt-ad'
import AmpFooter from '../../../components/amp/amp-footer'
import AmpGptStickyAd from '../../../components/amp/amp-ads/amp-gpt-sticky-ad'
import Taboola from '../../../components/amp/amp-ads/taboola-ad'
import AmpMain from '../../../components/amp/external/amp-main'
import { transformHtmlIntoAmpHtml } from '../../../utils/amp-html'
import Script from 'next/script'
import JsonLdsScripts from '../../../components/externals/shared/json-lds-scripts'

export const config = { amp: true }

const AmpBody = styled.body`
  background: #f5f5f5;
`

/**
 * @typedef {import('../../../apollo/fragments/external').External} External
 */

/**
 *
 * @param {Object} props
 * @param {External} props.external
 * @param {Object} props.headerData
 * @returns {JSX.Element}
 */
export default function External({ external }) {
  const { slug, title, brief, thumb, partner } = external
  const ampGptStickyAdScript = (
    <Script
      async
      // eslint-disable-next-line react/no-unknown-property
      custom-element="amp-sticky-ad"
      src="https://cdn.ampproject.org/v0/amp-sticky-ad-1.0.js"
    />
  )
  const nonAmpUrl = `https://${SITE_URL}/external/${slug}`
  const canonicalLink = (
    <link rel="canonical" href={nonAmpUrl} key="canonical"></link>
  )

  // The property `partner` for external article may lost for some reasons, `showOnIndex` will be set to true to handle this case.
  const showOnIndex =
    partner && Object.prototype.hasOwnProperty.call(partner, 'showOnIndex')
      ? partner.showOnIndex
      : 'true'
  const gptAdSection = showOnIndex ? 'news' : 'life'

  return (
    <>
      <Head>
        {ampGptStickyAdScript}
        {canonicalLink}
      </Head>
      <JsonLdsScripts external={external} currentPage="/external/amp/" />
      <Layout
        head={{
          title,
          description: brief,
          imageUrl: thumb,
          skipCanonical: true,
        }}
        header={{ type: 'empty' }}
        footer={{ type: 'empty' }}
      >
        <>
          {/* @ts-ignore */}
          <amp-analytics
            type="googleanalytics"
            config="https://amp.analytics-debugger.com/ga4.json"
            data-credentials="include"
          >
            <script
              type="application/json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  vars: {
                    GA4_MEASUREMENT_ID: GA_MEASUREMENT_ID,
                    GA4_ENDPOINT_HOSTNAME: 'www.google-analytics.com',
                    GOOGLE_CONSENT_ENABLED: false,
                    WEBVITALS_TRACKING: false,
                    PERFORMANCE_TIMING_TRACKING: false,
                    DEFAULT_PAGEVIEW_ENABLED: true,
                    SEND_DOUBLECLICK_BEACON: false,
                    DISABLE_REGIONAL_DATA_COLLECTION: false,
                    ENHANCED_MEASUREMENT_SCROLL: false,
                  },
                }),
              }}
            />
            {/* @ts-ignore */}
          </amp-analytics>
          <AmpBody>
            <section id="amp-page">
              <AmpHeader />
              <AmpGptAd section={gptAdSection} position="HD" />

              <AmpMain external={external} />

              <Taboola title="你可能也喜歡這些文章" />
              <AmpGptAd section={gptAdSection} position="FT" />
              <AmpFooter />
              <AmpGptStickyAd />
            </section>
          </AmpBody>
        </>
      </Layout>
    </>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ params, req, res, resolvedUrl }) {
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

  /** @type {External} */
  const external =
    handledResponses[0] && 'data' in handledResponses[0]
      ? handledResponses[0]?.data?.externals[0] || {}
      : {}

  if (!Object.keys(external).length) {
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `The external article which slug is '${slug}' does not exist, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }

  // transform html into valid amp html, check transformHtmlIntoAmpHtml function for further detail.
  const html = external.content
  external.content = transformHtmlIntoAmpHtml(html, resolvedUrl)

  if (!Object.keys(external).length) {
    return { notFound: true }
  }

  const props = {
    external,
  }

  return { props }
}
