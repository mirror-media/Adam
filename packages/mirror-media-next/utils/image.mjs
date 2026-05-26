const RESIZED_IMAGE_KEYS = ['w480', 'w800', 'w1200', 'w1600', 'w2400']
const LISTING_IMAGE_FIELD_KEYS = new Set([
  'heroImage',
  'og_image',
  'ogImage',
  'coverPhoto',
])

/**
 * @param {string} url
 * @returns {{prefix: string, extension: string, suffix: string} | null}
 */
function splitImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return null
  }

  const suffixStart = (() => {
    const queryIndex = url.indexOf('?')
    const hashIndex = url.indexOf('#')

    if (queryIndex === -1) return hashIndex
    if (hashIndex === -1) return queryIndex
    return Math.min(queryIndex, hashIndex)
  })()
  const path = suffixStart === -1 ? url : url.slice(0, suffixStart)
  const suffix = suffixStart === -1 ? '' : url.slice(suffixStart)
  const lastSlashIndex = path.lastIndexOf('/')
  const filename = path.slice(lastSlashIndex + 1)
  const extensionMatch = filename.match(/(\.[^.]+)$/)

  if (!extensionMatch) {
    return null
  }

  const extension = extensionMatch[1]
  return {
    prefix: path.slice(0, -extension.length),
    extension,
    suffix,
  }
}

/**
 * @param {string} original
 * @param {string} sizeKey
 * @param {string} [extension]
 * @returns {string | undefined}
 */
function buildImageUrl(original, sizeKey, extension) {
  const urlParts = splitImageUrl(original)

  if (!urlParts) {
    return undefined
  }

  const sizeSuffix = sizeKey === 'original' ? '' : `-${sizeKey}`
  return `${urlParts.prefix}${sizeSuffix}${extension ?? urlParts.extension}${
    urlParts.suffix
  }`
}

/**
 * @param {Record<string, string | undefined | null> | null | undefined} images
 * @returns {Record<string, string> | undefined}
 */
function compactImageUrlMap(images) {
  if (!images || typeof images !== 'object') {
    return undefined
  }

  const compacted = Object.entries(images).reduce((acc, [key, value]) => {
    if (typeof value === 'string' && value) {
      acc[key] = value
    }
    return acc
  }, {})

  return Object.keys(compacted).length ? compacted : undefined
}

/**
 * @param {Record<string, string> | undefined} generated
 * @param {Record<string, string | undefined | null> | null | undefined} current
 * @returns {Record<string, string> | undefined}
 */
function mergeGeneratedImageUrls(generated, current) {
  const compactedCurrent = compactImageUrlMap(current)

  if (!generated && !compactedCurrent) {
    return undefined
  }

  return {
    ...(generated ?? {}),
    ...(compactedCurrent ?? {}),
  }
}

/**
 * @param {string | null | undefined} original
 * @returns {Record<string, string> | undefined}
 */
function buildResizedImagesFromOriginal(original) {
  if (!original || typeof original !== 'string') {
    return undefined
  }

  const generated = RESIZED_IMAGE_KEYS.reduce(
    (acc, sizeKey) => {
      const url = buildImageUrl(original, sizeKey)
      if (url) {
        acc[sizeKey] = url
      }
      return acc
    },
    { original }
  )

  return generated
}

/**
 * @param {string | null | undefined} original
 * @returns {Record<string, string> | undefined}
 */
function buildResizedWebPImagesFromOriginal(original) {
  if (!original || typeof original !== 'string') {
    return undefined
  }

  const webPOriginal = buildImageUrl(original, 'original', '.webP')

  if (!webPOriginal) {
    return undefined
  }

  return RESIZED_IMAGE_KEYS.reduce(
    (acc, sizeKey) => {
      const url = buildImageUrl(original, sizeKey, '.webP')
      if (url) {
        acc[sizeKey] = url
      }
      return acc
    },
    { original: webPOriginal }
  )
}

/**
 * @param {Record<string, string | undefined | null> | null | undefined} resized
 * @returns {Record<string, string> | undefined}
 */
function normalizeResizedImages(resized) {
  const original = resized?.original
  return mergeGeneratedImageUrls(
    buildResizedImagesFromOriginal(original),
    resized
  )
}

/**
 * @param {Record<string, string | undefined | null> | null | undefined} resizedWebp
 * @param {string | null | undefined} fallbackOriginal
 * @returns {Record<string, string> | undefined}
 */
function normalizeResizedWebPImages(resizedWebp, fallbackOriginal) {
  const sourceOriginal = resizedWebp?.original || fallbackOriginal
  return mergeGeneratedImageUrls(
    buildResizedWebPImagesFromOriginal(sourceOriginal),
    resizedWebp
  )
}

/**
 * @param {Record<string, any> | string | null | undefined} image
 * @returns {Record<string, any> | null}
 */
function normalizeImageForRender(image) {
  if (typeof image === 'string') {
    return normalizeImageForRender({ resized: { original: image } })
  }

  if (!image || typeof image !== 'object') {
    return null
  }

  const resized = normalizeResizedImages(image.resized)

  return {
    ...image,
    resized,
    resizedWebp: normalizeResizedWebPImages(
      image.resizedWebp,
      resized?.original
    ),
  }
}

/**
 * @param {Record<string, any> | string | null | undefined} image
 * @returns {Record<string, any> | string | null | undefined}
 */
function compactImageForClientPayload(image) {
  if (typeof image === 'string' || image === null || image === undefined) {
    return image
  }

  if (typeof image !== 'object') {
    return undefined
  }

  const compacted = Object.entries(image).reduce((acc, [key, value]) => {
    if (
      key === '__typename' ||
      key === 'resized' ||
      key === 'resizedWebp' ||
      value === undefined
    ) {
      return acc
    }

    acc[key] = compactListingImagePayload(value)
    return acc
  }, {})

  const original = image.resized?.original || image.resizedWebp?.original

  if (original) {
    compacted.resized = { original }
  }

  return Object.keys(compacted).length ? compacted : undefined
}

/**
 * Compact static listing payloads to the same image contract used by the
 * story payload: only original URLs are sent to the browser, and render-time
 * helpers rebuild generated sizes.
 *
 * @param {any} payload
 * @returns {any}
 */
function compactListingImagePayload(payload) {
  if (Array.isArray(payload)) {
    return payload.map(compactListingImagePayload)
  }

  if (!payload || typeof payload !== 'object') {
    return payload
  }

  return Object.entries(payload).reduce((acc, [key, value]) => {
    if (key === '__typename' || value === undefined) {
      return acc
    }

    if (LISTING_IMAGE_FIELD_KEYS.has(key)) {
      const compactedImage = compactImageForClientPayload(value)
      if (compactedImage !== undefined) {
        acc[key] = compactedImage
      }
      return acc
    }

    acc[key] = compactListingImagePayload(value)
    return acc
  }, {})
}

/**
 * To get the URL link for `og-image`, sorted in ascending order based on file size.
 * Skip w480 to prevent image size minimum 200 x 200.
 * It's recommended for using images which is at least 1200 * 630 pixels on high resolution devices, so we use w1600 at first.
 * @param {Record<string, string | undefined | null> | undefined | null} resized
 * @param {string} [preferredSize]
 * @returns {string | undefined}
 */
function getResizedUrl(resized, preferredSize = 'w1600') {
  const normalized = normalizeResizedImages(resized)

  if (!normalized) {
    return undefined
  }

  return (
    normalized[preferredSize] ||
    normalized.w1600 ||
    normalized.w2400 ||
    normalized.original
  )
}

export {
  buildResizedImagesFromOriginal,
  buildResizedWebPImagesFromOriginal,
  compactImageForClientPayload,
  compactListingImagePayload,
  getResizedUrl,
  normalizeImageForRender,
  normalizeResizedImages,
  normalizeResizedWebPImages,
}
