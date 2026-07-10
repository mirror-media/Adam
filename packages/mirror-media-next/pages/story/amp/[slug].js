import Head from 'next/head'
import MirrorMedia from '@mirrormedia/lilith-draft-renderer/lib/website/mirrormedia'
import styled from 'styled-components'

import client from '../../../apollo/apollo-client'
import { fetchAmpPostBySlug } from '../../../apollo/query/posts'
import AmpFooter from '../../../components/amp/amp-footer'
import AmpHeader from '../../../components/amp/amp-header'
import AmpMain from '../../../components/amp/amp-main'
import AmpRelated from '../../../components/amp/amp-related'
import Layout from '../../../components/shared/layout'
import WineWarning from '../../../components/shared/wine-warning'
import AdultOnlyWarning from '../../../components/story/shared/adult-only-warning'
import { ENV, GA_MEASUREMENT_ID, SITE_URL } from '../../../config/index.mjs'
import {
  convertDraftToText,
  getActiveOrderSection,
  getCategoryOfWineSlug,
  getLogTraceObject,
  getResizedUrl,
} from '../../../utils'
import { setPageCache } from '../../../utils/cache-setting'
import { handleStoryPageRedirect } from '../../../utils/story'
const { hasContentInRawContentBlock } = MirrorMedia
import AmpGptAd from '../../../components/amp/amp-ads/amp-gpt-ad'
import AmpGptStickyAd from '../../../components/amp/amp-ads/amp-gpt-sticky-ad'
import Taboola from '../../../components/amp/amp-ads/taboola-ad'
import { generateJsonLdsData } from '../../../components/story/shared/json-lds-data'
import JsonLdsScript from '../../../components/story/shared/json-lds-script'
import { getAmpGptDataSlotSection } from '../../../utils/ad'
import { getRelatedStories } from '../../../utils/api/recommendation'
import { toTaipeiISOString } from '../../../utils/index'
import { logGqlError } from '../../../utils/log/shared'

export const config = { amp: true }

const AmpBody = styled.body`
  background: #f5f5f5;
  #amp-page.disable-scroll {
    height: 100vh;
    overflow: hidden;
  }
  #amp-page.is-wine {
    margin-bottom: 5vh;
    ${({ theme }) => theme.breakpoint.sm} {
      margin-bottom: 10vh;
    }
  }
`

/**
 * @typedef {import('../../../apollo/fragments/post').Post} PostData
 */

/**
 *
 * @param {Object} props
 * @param {PostData} props.postData
 * @param {Object[]} props.jsonLdData
 * @returns {React.ReactElement}
 */

function StoryAmpPage({ postData, jsonLdData }) {
  const {
    title = '',
    slug = '',
    isMember = false,
    isAdult = false,
    categories = [],
    sections = [],
    sectionsInInputOrder = [],
    publishedDate = '',
    updatedAt = '',
  } = postData

  const sectionsWithOrdered = getActiveOrderSection(
    sections,
    sectionsInInputOrder
  )
  const [section] = sectionsWithOrdered

  const gptSlotSection = getAmpGptDataSlotSection(section, isMember)

  const categoryOfWineSlug = getCategoryOfWineSlug(categories)

  // Use allRelatedStories from postData that was fetched in getServerSideProps
  const allRelatedStories = postData.allRelatedStories || []

  const nonAmpUrl = `https://${SITE_URL}/story/${slug}`
  const ampGptStickyAdScript = (
    <script
      async
      // eslint-disable-next-line react/no-unknown-property
      custom-element="amp-sticky-ad"
      src="https://cdn.ampproject.org/v0/amp-sticky-ad-1.0.js"
    />
  )
  const canonicalLink = (
    <link rel="canonical" href={nonAmpUrl} key="canonical"></link>
  )
  const pubDate = (
    <meta
      name="pubdate"
      property="article:published_time"
      itemProp="datePublished"
      content={toTaipeiISOString(publishedDate)}
      key="article:published_time"
    />
  )

  const lastMod = (
    <meta
      name="lastmod"
      property="article:modified_time"
      itemProp="dateModified"
      content={toTaipeiISOString(updatedAt)}
      key="article:modified_time"
    />
  )
  return (
    <>
      <Head>
        {ampGptStickyAdScript}
        {canonicalLink}
        {pubDate}
        {lastMod}
      </Head>
      <Layout
        head={{
          title: `${title}`,
          description:
            convertDraftToText(postData.brief) ||
            convertDraftToText(postData.content),
          imageUrl:
            getResizedUrl(postData.og_image?.resized) ||
            getResizedUrl(postData.heroImage?.resized),
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
            <section
              id="amp-page"
              className={`${!!categoryOfWineSlug.length && 'is-wine'} ${
                isAdult && 'disable-scroll'
              }`}
            >
              <AmpHeader />
              <AmpGptAd section={gptSlotSection} position="HD" />

              <AmpMain postData={postData} gptSlotSection={gptSlotSection} />
              <AmpRelated
                relateds={allRelatedStories}
                gptSlotSection={gptSlotSection}
              />
              <Taboola title="你可能也喜歡這些文章" />

              <AmpGptAd section={gptSlotSection} position="FT" />

              <AmpFooter />
              {/* If there are wine categories (length greater than 0), AmpGptStickyAd will not be shown. */}
              {categoryOfWineSlug.length === 0 && <AmpGptStickyAd />}
            </section>
            <AdultOnlyWarning isAdult={isAdult} />
            <WineWarning categories={categories} />
          </AmpBody>
        </>
      </Layout>
      <JsonLdsScript jsonLdData={jsonLdData}></JsonLdsScript>
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

  try {
    const result = await client.query({
      query: fetchAmpPostBySlug,
      variables: { slug },
    })
    /**
     * @type {PostData}
     */
    const postData = result?.data?.post
    if (!postData || postData?.isAdvertised) {
      return { notFound: true }
    }
    const { style } = postData

    /**
     * If post style is 'projects' or 'campaign', redirect to certain route.
     *
     * There is no `/projects` or `/campaign` pages in mirror-media-next, when user enter path `/projects/_slug` or `/campaign`,
     * Load balancer hosted by Google Cloud Platform will help us to get page content of project or campaign page.
     * The content of certain page is placed at Google Cloud Storage.
     */
    if (style === 'projects' || style === 'campaign') {
      return {
        redirect: {
          destination: `/${style}/${slug} `,
          permanent: false,
        },
      }
    }

    // Check if the post data has content in the brief, trimmedContent, or content fields
    const shouldCheckHasContent =
      style === 'article' || style === 'wide' || style === 'photography'

    if (shouldCheckHasContent) {
      const hasBrief = hasContentInRawContentBlock(postData.brief)

      const hasTrimmedContent = hasContentInRawContentBlock(
        postData.trimmedContent
      )
      const hasFullContent = hasContentInRawContentBlock(postData.content)

      // If none of the fields have content, return notFound as true
      if (!hasBrief && !hasTrimmedContent && !hasFullContent) {
        return { notFound: true }
      }
    }

    //redirect to specific slug or external url
    const redirect = postData?.redirect
    if (redirect) {
      return handleStoryPageRedirect(redirect)
    }

    // Fetch related stories
    const relatedsWithOrdered =
      postData.relatedsInInputOrder && postData.relatedsInInputOrder.length
        ? postData.relatedsInInputOrder
        : postData.relateds

    const initialStories = [
      ...(postData.relatedsOne ? [postData.relatedsOne] : []),
      ...(postData.relatedsTwo ? [postData.relatedsTwo] : []),
      ...relatedsWithOrdered,
    ].slice(0, 10)

    let allRelatedStories = [...initialStories]

    if (initialStories.length < 10) {
      const filterIds = initialStories.map(
        (story) => `mirrormedia_story_${story.slug}`
      )
      try {
        const result = await getRelatedStories(
          postData.slug,
          filterIds,
          10 - initialStories.length,
          'story'
        )

        if (result && result.data && result.data.products) {
          const formattedStories = result.data.products.map((product) => {
            const productId = product.product_id
            const relatedSlug = productId.split('_').slice(2).join('_')

            return {
              id: productId,
              slug: relatedSlug,
              title: product.title || '',
              url: product.url || `/story/${relatedSlug}`,
              type: 'story',
              heroImage: product.cover_image
                ? {
                    resized: { original: product.cover_image },
                  }
                : null,
              brief: { blocks: [{ text: '' }] },
              categories: [],
              sections: [],
              isMesoRecommend: true,
            }
          })
          allRelatedStories = [...initialStories, ...formattedStories]
        }
      } catch (error) {
        console.error(
          'Failed to fetch MISO related stories:',
          JSON.stringify(error)
        )
        // Keep initialStories if API call fails
        allRelatedStories = initialStories
      }
    }

    const jsonLdData = generateJsonLdsData(postData, '/story/amp/')

    return {
      props: {
        postData: {
          ...postData,
          allRelatedStories,
        },
        jsonLdData,
      },
    }
  } catch (err) {
    logGqlError(
      err,
      `Error occurs while getting data in story amp page (slug: ${slug})`,
      globalLogFields
    )
    throw new Error(
      `Error occurs while getting data in story amp page (slug: ${slug})`
    )
  }
}

export default StoryAmpPage
