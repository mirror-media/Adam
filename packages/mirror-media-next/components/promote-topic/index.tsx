import { useEffect, useState } from 'react'

import type { PromoteTopicData } from './fetch-promote-topics'
import { fetchPromoteTopics } from './fetch-promote-topics'
import PromoteTopicSwiper from './promote-topic-swiper'

export default function PromoteTopic() {
  const [list, setList] = useState<PromoteTopicData[]>([])

  useEffect(() => {
    fetchPromoteTopics().then(setList)
  }, [])

  if (!list.length) return null

  return <PromoteTopicSwiper list={list} />
}
