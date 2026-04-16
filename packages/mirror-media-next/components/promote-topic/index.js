import { useEffect, useState } from 'react'

import { URL_STATIC_PROMOTE_TOPICS } from '../../config/index.mjs'
import { fetchStaticJsonByUrl } from '../../utils/api'
import PromoteTopicSwiper from './promote-topic-swiper'

/**
 * @typedef {import('./promote-topic-item').PromoteTopicData} PromoteTopicData
 */

/**
 * @param {unknown} promoteTopics
 * @returns {PromoteTopicData[]}
 */
const normalizePromoteTopics = (promoteTopics) => {
  if (!Array.isArray(promoteTopics)) return []

  return promoteTopics
    .map((item) => item?.topics)
    .filter((topic) => {
      const hasImage = Object.values(topic?.heroImage?.resized ?? {}).some(
        Boolean
      )

      return Boolean(topic?.slug && topic?.name && hasImage)
    })
}

export default function PromoteTopic() {
  const [topics, setTopics] = useState([])

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
