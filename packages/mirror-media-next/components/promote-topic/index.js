import { useEffect, useState } from 'react'

import { URL_STATIC_PROMOTE_TOPICS } from '../../config/index.mjs'
import { fetchStaticJsonByUrl } from '../../utils/api'
import PromoteTopicSwiper from './promote-topic-swiper'

/**
 * @typedef {import('./promote-topic-item').PromoteTopicData} PromoteTopicData
 *
 * @typedef {Object} RawPromoteTopicHeroImage
 * @property {Record<string, string>} [resized]
 * @property {Record<string, string>} [resizedWebp]
 *
 * @typedef {Object} RawPromoteTopic
 * @property {string} [id]
 * @property {string} [slug]
 * @property {string} [name]
 * @property {RawPromoteTopicHeroImage | null} [heroImage]
 *
 * @typedef {Object} RawPromoteTopicItem
 * @property {string | number} [id]
 * @property {string | number | null} [order]
 * @property {RawPromoteTopic | null} [topics]
 *
 * @typedef {Object} PromoteTopicsStaticJsonResponse
 * @property {RawPromoteTopicItem[]} [promoteTopics]
 */

/**
 * @param {Record<string, string> | null | undefined} images
 * @returns {boolean}
 */
function hasAvailableImages(images) {
  return Object.values(images ?? {}).some(Boolean)
}

/**
 * @param {RawPromoteTopicItem | null | undefined} item
 * @returns {PromoteTopicData | null}
 */
function normalizePromoteTopic(item) {
  const topic = item?.topics
  const heroImage = topic?.heroImage
  const resized = heroImage?.resized
  const resizedWebp = heroImage?.resizedWebp
  const hasImage = hasAvailableImages(resized)

  // Guard against incomplete CMS data before it reaches UI components.
  if (!topic?.slug || !topic?.name || !hasImage) {
    return null
  }

  return {
    id: String(item?.id ?? topic.id ?? topic.slug),
    order: item?.order ?? null,
    slug: topic.slug,
    name: topic.name,
    heroImage: {
      resized: resized ?? {},
      resizedWebp: hasAvailableImages(resizedWebp) ? resizedWebp : undefined,
    },
  }
}

/**
 * @param {unknown} promoteTopics
 * @returns {PromoteTopicData[]}
 */
function normalizePromoteTopics(promoteTopics) {
  if (!Array.isArray(promoteTopics)) return []

  return promoteTopics.reduce((topics, item) => {
    const topic = normalizePromoteTopic(item)

    if (topic) {
      topics.push(topic)
    }

    return topics
  }, /** @type {PromoteTopicData[]} */ ([]))
}

/**
 * @returns {React.ReactElement | null}
 */
export default function PromoteTopic() {
  const [topics, setTopics] = useState(/** @type {PromoteTopicData[]} */ ([]))

  useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      try {
        const response =
          /** @type {{ data: PromoteTopicsStaticJsonResponse }} */ (
            await fetchStaticJsonByUrl(URL_STATIC_PROMOTE_TOPICS, {
              signal: abortController.signal,
            })
          )
        setTopics(normalizePromoteTopics(response.data.promoteTopics))
      } catch (err) {
        const error =
          /** @type {(Error & { code?: string }) | null | undefined} */
          (err)

        if (
          abortController.signal.aborted ||
          error?.code === 'ERR_CANCELED' ||
          error?.name === 'CanceledError'
        ) {
          return
        }

        setTopics([])
      }
    }

    fetchData()

    return () => {
      abortController.abort()
    }
  }, [])

  if (!topics.length) return null

  return <PromoteTopicSwiper list={topics} />
}
