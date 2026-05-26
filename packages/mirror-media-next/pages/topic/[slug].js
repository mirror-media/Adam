// TODO: modify component `<WineWarning>`, no need to props `categories`

import { ENV, SITE_URL } from '../../config/index.mjs'
import TopicList from '../../components/topic/list/topic-list'
import TopicGroup from '../../components/topic/group/topic-group'
import WineWarning from '../../components/shared/wine-warning'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import Head from 'next/head'
import { parseUrl } from '../../utils/topic'
import {
  convertDraftToText,
  toTaipeiISOString,
  getLogTraceObject,
  getResizedUrl,
  sortArrayWithOtherArrayId,
} from '../../utils/index'
import { processSettledResult } from '../../utils/response-processor'
import { fetchTopicByTopicSlug } from '../../utils/api/topic'
import { logGqlError } from '../../utils/log/shared'
import SlotAndBanner from '../../components/slot/slot-and-banner'
import { SITE_TITLE } from '../../constants/index'

const RENDER_PAGE_SIZE = 12
const WINE_TOPICS_SLUG = [
  '5c25f9e3315ec51000903a82',
  '5d22bb9fe311f3925c49396c',
  '5a4d8e60160ac91000294611',
  '5ff7d152127ff40f00d7125c',
  '61d6ade96fef6b0f00f8407e',
  '63b7907e7d893f1a00f1ddb1',
  'thebalvenie2023',
  'wine2024',
  'rsroyalsalute2024',
]
/**
 * @typedef {import('../../components/topic/list/topic-list').SlideshowImage} SlideshowImage
 * @typedef {import('../../components/topic/list/topic-list').Topic} Topic
 */

/**
 * @param {Object} props
 * @param {Topic} props.topic
 * @param {SlideshowImage[]} props.slideshowImages
 * @param {Object} props.headerData
 * @returns
 */
export default function Topic({ topic, slideshowImages, headerData }) {
  const postJsonData =
    topic?.posts?.slice(0, 5)?.map((post, index) => {
      const writersWithOrdered = post.writersInInputOrder?.length
        ? post.writersInInputOrder
        : post.writers
      const hasWriter = writersWithOrdered?.length > 0

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'NewsArticle',
          url: `https://${SITE_URL}/story/${post.slug}`,
          headline: post.title,
          image:
            getResizedUrl(post.heroImage?.resized, 'w800') ||
            `https://${SITE_URL}/images-next/default-og-img.png`,
          datePublished: toTaipeiISOString(post.publishedDate),
          author: hasWriter
            ? writersWithOrdered.map((writer) => ({
                '@type': 'Person',
                name: writer.name,
                url: `https://${SITE_URL}/author/${writer.id}`,
              }))
            : {
                '@type': 'Organization',
                name: SITE_TITLE,
                url: `https://${SITE_URL}`,
              },
        },
      }
    }) || []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: postJsonData.length,
    itemListElement: postJsonData,
  }

  const pubDate = (
    <meta
      name="pubdate"
      property="article:published_time"
      itemProp="datePublished"
      content={toTaipeiISOString(topic.createdAt)}
      key="pubdate"
    />
  )

  const lastMod = (
    <meta
      name="lastmod"
      property="article:modified_time"
      itemProp="dateModified"
      content={toTaipeiISOString(
        topic.posts[0]?.updatedAt || topic.posts[0]?.publishedDate
      )}
      key="lastmod"
    />
  )

  const shouldShowWineWarning = WINE_TOPICS_SLUG.some(
    (slug) => slug === topic.slug
  )

  let topicJSX

  switch (topic.type) {
    case 'list':
      topicJSX = (
        <>
          <TopicList
            topic={topic}
            renderPageSize={RENDER_PAGE_SIZE}
            slideshowImages={slideshowImages}
          />
        </>
      )
      break
    case 'group':
      topicJSX = (
        <>
          <TopicGroup topic={topic} />
        </>
      )
      break
    default:
      topicJSX = (
        <>
          <TopicList
            topic={topic}
            renderPageSize={RENDER_PAGE_SIZE}
            slideshowImages={slideshowImages}
          />
        </>
      )
  }

  return (
    <Layout
      head={{
        title: `${topic?.name}`,
        // fallback to undefined if text is empty string or falsy value
        description:
          topic?.og_description ||
          convertDraftToText(topic?.brief) ||
          undefined,
        imageUrl:
          getResizedUrl(topic?.og_image?.resized) || parseUrl(topic?.style),
      }}
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <Head>
        {topic.createdAt ? pubDate : null}
        {topic.posts[0]?.updatedAt || topic.posts[0]?.publishedDate
          ? lastMod
          : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      {topicJSX}
      {shouldShowWineWarning && (
        <>
          {/* @ts-ignore */}
          <WineWarning categories={[{ slug: 'wine' }]}></WineWarning>
        </>
      )}
      <SlotAndBanner />
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ query, req, res }) {
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
  const topicSlug = Array.isArray(query.slug) ? query.slug[0] : query.slug

  const globalLogFields = getLogTraceObject(req)

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchTopicByTopicSlug(topicSlug, RENDER_PAGE_SIZE, 0),
  ])

  // handle header data
  const [sectionsData, topicsData] = processSettledResult(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    `Error occurs while getting header data in topic page (topicSlug: ${topicSlug})`,
    globalLogFields
  )

  // handle fetch topic data
  /** @type {Topic[]} */
  const topics = processSettledResult(
    responses[1],
    (gqlData) => {
      return gqlData?.data?.topics || []
    },
    `Error occurs while getting topics in topic page (topicSlug: ${topicSlug})`,
    globalLogFields
  )

  const topic = topics[0]
  if (!topic) {
    // fetchTopic return empty array -> wrong authorId -> 404
    console.log(
      JSON.stringify({
        severity: 'WARNING',
        message: `fetch topic with topic slug ${topicSlug} return null, redirect to 404`,
        globalLogFields,
      })
    )
    return { notFound: true }
  }

  /** @type {SlideshowImage[]} */
  let slideshowImages = []
  if (topic.leading === 'slideshow' && topic.slideshow_images) {
    const { slideshow_images, manualOrderOfSlideshowImages } = topic
    slideshowImages =
      manualOrderOfSlideshowImages === null
        ? slideshow_images
        : sortArrayWithOtherArrayId(
            slideshow_images,
            manualOrderOfSlideshowImages
          )
  }

  /**
   * load all group articles at once
   * (potential performance [issue](https://nextjs.org/docs/messages/large-page-data))
   * might need to optimize to load more on client side in next phase
   */
  if (topic.type === 'group' && topic.postsCount > RENDER_PAGE_SIZE) {
    let moreTopicPosts = []
    try {
      const topicData = await fetchTopicByTopicSlug(
        topicSlug,
        topic.postsCount,
        0
      )
      if (!Array.isArray(topicData.data.topics?.[0]?.posts)) return
      moreTopicPosts = topicData.data.topics[0].posts
    } catch (error) {
      logGqlError(
        error,
        `Fetch more topic post with topicId ${topicSlug} for group type in topic page failed at server-side`,
        globalLogFields
      )
      // stop fetching cause there might be infinite loop
    }
    topic.posts = [...moreTopicPosts]
  }

  const props = {
    topic,
    slideshowImages,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
