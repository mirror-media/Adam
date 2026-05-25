//TODO: add component to add html head dynamically, not jus write head in every pag
import React, { useState, useEffect, useMemo, useRef } from 'react'

import client, { getStoryClient } from '../../apollo/apollo-client'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import {
  API_TIMEOUT,
  ENV,
  URL_STATIC_POST_FLASH_NEWS,
  // TEST_GPT_AD_FEATURE_TOGGLE,
  STORY_GQL_ENDPOINT,
  IS_PREVIEW_MODE,
} from '../../config/index.mjs'
import WineWarning from '../../components/shared/wine-warning'
import AdultOnlyWarning from '../../components/story/shared/adult-only-warning'
import { fetchStoryPostBySlug } from '../../apollo/query/posts'
import StoryNormalStyle from '../../components/story/normal'
import Layout from '../../components/shared/layout'
import UserBehaviorLogger from '../../components/shared/user-behavior-logger'
import StoryHead from '../../components/story/shared/story-head'
import {
  convertDraftToText,
  getResizedUrl,
  getCategoryOfWineSlug,
  getLogTraceObject,
} from '../../utils'
import { logAxiosError, logGqlError } from '../../utils/log/shared'
import { handleStoryPageRedirect } from '../../utils/story'
import MirrorMedia from '@mirrormedia/lilith-draft-renderer/lib/website/mirrormedia'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import {
  getInitialRelatedStories,
  serializeStoryPostDataForClient,
} from '../../utils/story-page-props.mjs'

import JsonLdsScript from '../../components/story/shared/json-lds-script'
import { generateJsonLdsData } from '../../components/story/shared/json-lds-data'
import FullScreenAds from '../../components/ads/full-screen-ads'
const { hasContentInRawContentBlock } = MirrorMedia

const StoryWideStyle = dynamic(() => import('../../components/story/wide'))
const StoryPhotographyStyle = dynamic(() =>
  import('../../components/story/photography')
)
import Image from 'next/image'
import Skeleton from '../../public/images-next/skeleton.png'
import axios from 'axios'
import { processSettledResult } from '../../utils/response-processor'
import { getRelatedStories } from '../api/recomemd'
const MisoPageView = dynamic(() => import('../../components/miso-pageview'), {
  ssr: false,
})
// import DevGptAd from '../../components/story/dev-gpt-ad'

/**
 * @typedef {import('../../components/story/normal').PostData} PostData
 * @typedef {import('../../components/story/normal').PostContent} PostContent
 * @typedef {'style-normal' | 'style-photography' | 'style-wide'} StoryLayoutType
 * @typedef {import('../../components/header/share-header').HeaderData} HeaderData
 * @typedef {HeaderData['flashNewsData']} flashNewsData
 * @typedef {import('axios').AxiosResponse<Record<'posts',flashNewsData>>} AxiosResponse
 * @typedef {import('../../utils/api').HeadersData} HeadersData
 * @typedef {import('../../utils/api').Topics} Topics
 * @typedef {import('axios').AxiosResponse<HeaderData>} AxiosResponseHeaderData
 */

const Loading = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: fixed;

  img {
    margin: 0 auto;
  }
`

/**
 *
 * @param {import('../../components/story/normal').PostData['style']} articleStyle
 * @returns {StoryLayoutType }
 */
const getStoryLayoutType = (articleStyle) => {
  if (articleStyle === 'wide') {
    return 'style-wide'
  } else if (articleStyle === 'photography') {
    return 'style-photography'
  }
  return 'style-normal'
}

/**
 *
 * @param {Object} props
 * @param {PostData} props.postData
 * @param {import('../../apollo/fragments/post').Related[]} props.initialRelatedStories
 * @param {HeaderData} props.headerData
 * @param {flashNewsData} props.flashNewsData
 * @param {StoryLayoutType} props.storyLayoutType
 * @param {Object[]} props.jsonLdData
 * @returns {React.ReactNode}
 */
export default function Story({
  postData,
  initialRelatedStories = [],
  headerData,
  flashNewsData,
  storyLayoutType,
  jsonLdData,
}) {
  const {
    title = '',
    slug = '',
    isAdult = false,
    categories = [],
    content = null,
    hiddenAdvertised = false,
    writers = [],
  } = postData
  /** @type {PostContent} */
  const postContent = {
    type: 'fullContent',
    data: content ?? { blocks: [], entityMap: {} },
    isLoaded: true,
  }
  const [allRelatedStories, setAllRelatedStories] = useState(
    initialRelatedStories
  )
  const allRelatedStoriesRef = useRef(allRelatedStories)

  useEffect(() => {
    allRelatedStoriesRef.current = allRelatedStories
  }, [allRelatedStories])

  useEffect(() => {
    let cleanupScrollHandler = () => {}
    let isMounted = true

    // Wait for page to be fully rendered before setting up miso API calls.
    const setupScrollHandler = () => {
      const handleScroll = async () => {
        const currentRelatedStories = allRelatedStoriesRef.current

        if (currentRelatedStories.length < 10) {
          const filterIds = currentRelatedStories.map(
            (story) => `mirrormedia_story_${story.slug}`
          )
          try {
            const result = await getRelatedStories(
              postData.slug,
              filterIds,
              10 - currentRelatedStories.length,
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

              if (isMounted) {
                setAllRelatedStories((prev) => [...prev, ...formattedStories])
              }
            }
          } catch (error) {
            console.error('Failed to fetch MISO related stories:', error)
          }
        }
      }

      window.addEventListener('scroll', handleScroll, { once: true })
      cleanupScrollHandler = () =>
        window.removeEventListener('scroll', handleScroll)
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
      isMounted = false
      window.removeEventListener('load', setupScrollHandler)
      cleanupScrollHandler()
    }
  }, [postData.slug])

  const writersInString = useMemo(() => {
    return writers
      .map((writer) => {
        return writer.name
      })
      .join(',')
  }, [writers])

  const renderStoryLayout = () => {
    /**
     * Because GA is currently unable to send custom event, we use gtm className to collect custom page-view.
     */
    const classNameForGTM = 'GTM-story-page-view'
    switch (storyLayoutType) {
      case 'style-normal':
        return (
          <StoryNormalStyle
            postData={postData}
            postContent={postContent}
            headerData={headerData}
            flashNewsData={flashNewsData}
            classNameForGTM={classNameForGTM}
            allRelatedStories={allRelatedStories}
          />
        )
      case 'style-wide':
        return (
          <StoryWideStyle
            postData={postData}
            postContent={postContent}
            classNameForGTM={classNameForGTM}
            allRelatedStories={allRelatedStories}
          />
        )
      case 'style-photography':
        return (
          <StoryPhotographyStyle
            postData={postData}
            postContent={postContent}
            classNameForGTM={classNameForGTM}
            allRelatedStories={allRelatedStories}
          />
        )
      default:
        return (
          <StoryNormalStyle
            postData={postData}
            postContent={postContent}
            headerData={headerData}
            flashNewsData={flashNewsData}
            classNameForGTM={classNameForGTM}
            allRelatedStories={allRelatedStories}
          />
        )
    }
  }
  const storyLayoutJsx = renderStoryLayout()
  //If no wine category, then should show gpt ST ad, otherwise, then should not show gpt ST ad.
  const noCategoryOfWineSlug = getCategoryOfWineSlug(categories).length === 0

  return (
    <>
      <StoryHead postData={postData} />
      <Layout
        head={{
          title: `${title}`,
          ogTitle: postData.og_title,
          description:
            convertDraftToText(postData.brief) ||
            convertDraftToText(postData.content),
          ogDescription: postData.og_description,
          imageUrl:
            getResizedUrl(postData.heroImage?.resized) ||
            getResizedUrl(postData.og_image?.resized),
          ogImageUrl:
            getResizedUrl(postData.og_image?.resized) ||
            getResizedUrl(postData.heroImage?.resized),
          skipCanonical: true,
          pageType: 'story',
          pageSlug: slug,
        }}
        header={{ type: 'empty' }}
        footer={{ type: 'empty' }}
      >
        <MisoPageView productIds={`story_${slug}`} />
        <UserBehaviorLogger writers={writersInString} />
        {!storyLayoutJsx && (
          <Loading>
            <Image src={Skeleton} alt="loading..."></Image>
          </Loading>
        )}
        {storyLayoutJsx}
        <WineWarning categories={categories} />
        <AdultOnlyWarning isAdult={isAdult} />
        {noCategoryOfWineSlug && (
          <FullScreenAds hiddenAdvertised={hiddenAdvertised} />
        )}
        {/* {TEST_GPT_AD_FEATURE_TOGGLE === 'on' && <DevGptAd />} */}
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
    const storyClient = IS_PREVIEW_MODE
      ? client
      : getStoryClient(STORY_GQL_ENDPOINT) || client

    const result = await storyClient.query({
      query: fetchStoryPostBySlug,
      variables: { slug },
    })

    /**
     * @type {PostData}
     */
    const postData = result?.data?.post

    if (!postData) {
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

    // Check if the post data has content in the brief or content fields
    const shouldCheckHasContent =
      style === 'article' || style === 'wide' || style === 'photography'

    if (shouldCheckHasContent) {
      const hasBrief = hasContentInRawContentBlock(postData.brief)
      const hasFullContent = hasContentInRawContentBlock(postData.content)

      // If none of the fields have content, return notFound as true
      if (!hasBrief && !hasFullContent) {
        return { notFound: true }
      }
    }

    const redirect = postData?.redirect
    if (redirect) {
      return handleStoryPageRedirect(redirect)
    }
    const storyLayoutType = getStoryLayoutType(postData?.style)
    let headerData = null
    let flashNewsData = null
    const shouldFetchDefaultHeaderData = storyLayoutType === 'style-normal'
    if (shouldFetchDefaultHeaderData) {
      try {
        const fetchStaticJsonSafe = async (url, timeout) => {
          try {
            const mod = await import(
              '../../utils/server-side-only/fetch-static-json.js'
            )
            const res = await mod.fetchStaticJsonOnServer(url, timeout)
            return res
          } catch (err) {
            return axios({
              method: 'get',
              url,
              timeout,
            })
          }
        }

        const responses = await Promise.allSettled([
          fetchStaticJsonSafe(URL_STATIC_POST_FLASH_NEWS, API_TIMEOUT),
          fetchHeaderDataInDefaultPageLayout(),
        ])
        flashNewsData = processSettledResult(
          responses[0],
          (/** @type {AxiosResponse} */ axiosData) => {
            return axiosData?.data?.posts ?? []
          },
          'Error occurs while getting flash news in story page',
          globalLogFields
        )
        headerData = processSettledResult(
          responses[1],
          (
            /** @type {{ sectionsData: HeadersData, topicsData: Topics } | null | undefined} */ axiosData
          ) => {
            return axiosData ?? { sectionsData: [], topicsData: [] }
          },
          'Error occurs while getting sectionsData and topicsData in story page',
          globalLogFields
        )
      } catch (err) {
        headerData = { sectionsData: [], topicsData: [] }
        logAxiosError(
          err,
          `Error occurs while getting header data in story page (slug: ${slug})`,
          globalLogFields
        )
      }
    }

    const jsonLdData = generateJsonLdsData(postData, '/story/')
    const initialRelatedStories = getInitialRelatedStories(postData)
    const clientPostData = serializeStoryPostDataForClient(postData)

    return {
      props: {
        postData: clientPostData,
        initialRelatedStories,
        flashNewsData,
        headerData,
        storyLayoutType,
        jsonLdData,
      },
    }
  } catch (err) {
    logGqlError(
      err,
      `Error occurs while getting data in story page (slug: ${slug})`,
      globalLogFields
    )
    throw new Error(
      `Error occurs while getting data in story page (slug: ${slug})`
    )
  }
}
