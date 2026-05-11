const IMAGE_SIZE_KEYS = new Set([
  'original',
  'w480',
  'w800',
  'w1200',
  'w1600',
  'w2400',
])

/**
 * @param {Record<string, any> | null | undefined} imageUrls
 * @returns {Record<string, any> | undefined}
 */
function compactImageUrls(imageUrls) {
  if (!imageUrls || typeof imageUrls !== 'object') {
    return undefined
  }

  const compacted = Object.entries(imageUrls).reduce((acc, [key, value]) => {
    if (!IMAGE_SIZE_KEYS.has(key)) {
      acc[key] = compactClientPayload(value)
      return acc
    }
    if (value) {
      acc[key] = value
    }
    return acc
  }, {})

  return Object.keys(compacted).length ? compacted : undefined
}

/**
 * Remove GraphQL metadata and empty generated image-size URLs before serializing
 * props into __NEXT_DATA__.
 *
 * @param {any} payload
 * @returns {any}
 */
function compactClientPayload(payload) {
  if (Array.isArray(payload)) {
    return payload.map(compactClientPayload)
  }

  if (!payload || typeof payload !== 'object') {
    return payload
  }

  return Object.entries(payload).reduce((acc, [key, value]) => {
    if (key === '__typename') {
      return acc
    }

    if (value === undefined) {
      return acc
    }

    if (key === 'resized' || key === 'resizedWebp') {
      const compactedImageUrls = compactImageUrls(value)
      if (compactedImageUrls) {
        acc[key] = compactedImageUrls
      }
      return acc
    }

    acc[key] = compactClientPayload(value)
    return acc
  }, {})
}

/**
 * @param {Record<string, any> | null | undefined} related
 * @returns {Record<string, any> | null}
 */
function normalizeRelatedStory(related) {
  if (!related) {
    return null
  }

  const type = related.__typename === 'External' ? 'external' : 'story'

  return compactClientPayload({
    id: related.id,
    slug: related.slug,
    title: related.title,
    url: related.url,
    type,
    heroImage: related.heroImage,
    isMesoRecommend: related.isMesoRecommend,
  })
}

/**
 * @param {Record<string, any>} postData
 * @returns {Record<string, any>[]}
 */
export function getInitialRelatedStories(postData) {
  const relatedsWithOrdered =
    postData.relatedsInInputOrder && postData.relatedsInInputOrder.length
      ? postData.relatedsInInputOrder
      : postData.relateds || []

  return [
    ...(postData.relatedsOne ? [postData.relatedsOne] : []),
    ...(postData.relatedsTwo ? [postData.relatedsTwo] : []),
    ...relatedsWithOrdered,
  ]
    .slice(0, 10)
    .map(normalizeRelatedStory)
    .filter(Boolean)
}

/**
 * @param {Record<string, any>} postData
 * @returns {Record<string, any>}
 */
export function serializeStoryPostDataForClient(postData) {
  const clientPostData = compactClientPayload(postData)

  delete clientPostData.relateds
  delete clientPostData.relatedsInInputOrder
  delete clientPostData.relatedsOne
  delete clientPostData.relatedsTwo
  delete clientPostData.trimmedContent

  return clientPostData
}
