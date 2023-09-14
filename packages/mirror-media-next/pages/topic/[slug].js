import errors from '@twreporter/errors'

import { GCP_PROJECT_ID, ENV } from '../../config/index.mjs'
import TopicList from '../../components/topic/list/topic-list'
import TopicGroup from '../../components/topic/group/topic-group'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import { parseUrl } from '../../utils/topic'
import {
  convertDraftToText,
  getResizedUrl,
  sortArrayWithOtherArrayId,
} from '../../utils/index'
import { fetchTopicByTopicSlug } from '../../utils/api/topic'

const RENDER_PAGE_SIZE = 12

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
      {topicJSX}
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ query, req, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 300 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }
  const topicSlug = Array.isArray(query.slug) ? query.slug[0] : query.slug
  const mockError = query.error === '500'

  const traceHeader = req.headers?.['x-cloud-trace-context']
  let globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
  }

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    fetchTopicByTopicSlug(topicSlug, RENDER_PAGE_SIZE, mockError ? NaN : 0),
  ])

  const handledResponses = responses.map((response, index) => {
    if (response.status === 'fulfilled') {
      if ('data' in response.value) {
        // handle gql requests
        return response.value.data
      }
      return response.value
    } else if (response.status === 'rejected') {
      const { graphQLErrors, clientErrors, networkError } = response.reason
      const annotatingError = errors.helpers.wrap(
        response.reason,
        'UnhandledError',
        'Error occurs while getting topic page data'
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
      if (index === 1) {
        // fetch key data (topic) failed, redirect to 500
        throw new Error('fetch topic failed')
      }
      return
    }
  })

  // handle header data
  const headerData =
    handledResponses[0] && 'sectionsData' in handledResponses[0]
      ? handledResponses[0]
      : { sectionsData: [], topicsData: [] }
  const sectionsData = Array.isArray(headerData.sectionsData)
    ? headerData.sectionsData
    : []
  const topicsData = Array.isArray(headerData.topicsData)
    ? headerData.topicsData
    : []

  // handle fetch topic data
  if (handledResponses[1]?.topics?.length === 0) {
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
  /** @type {Topic} */
  const topic = handledResponses[1]?.topics?.[0] || {}
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
    let posts = topic.posts
    while (posts.length < topic.postsCount) {
      let moreTopicPosts
      try {
        const topicData = await fetchTopicByTopicSlug(
          topicSlug,
          RENDER_PAGE_SIZE * 2,
          posts.length
        )
        moreTopicPosts = topicData.data.topics?.[0].posts || []
      } catch (error) {
        const annotatingError = errors.helpers.wrap(
          error,
          'GQLError',
          `Fetch more topic post with topicId ${topicSlug} for group type in getServerSideProps failed`
        )
        const { graphQLErrors, clientErrors, networkError } = error

        console.log(
          JSON.stringify({
            severity: 'ERROR',
            message: errors.helpers.printAll(annotatingError, {
              withStack: true,
              withPayload: true,
            }),
            debugPayload: {
              graphQLErrors,
              clientErrors,
              networkError,
            },
            ...globalLogFields,
          })
        )
        // stop fetching cause there might be infinite loop
        break
      }
      /** @type {Topic} */
      posts = [...posts, ...moreTopicPosts]
    }
    topic.posts = posts
  }

  const props = {
    topic,
    slideshowImages,
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
