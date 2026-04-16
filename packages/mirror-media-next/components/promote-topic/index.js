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

export default function PromoteTopic() {
  const [topics, setTopics] = useState(/** @type {PromoteTopicData[]} */ ([]))

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const res = await fetchStaticJsonByUrl(URL_STATIC_PROMOTE_TOPICS)
        if (!isMounted) return
        setTopics(normalizePromoteTopics(res.data?.promoteTopics))
      } catch {
        if (isMounted) setTopics([])
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  if (!topics.length) return null

  return <PromoteTopicSwiper list={topics} />
}
