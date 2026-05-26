/**
 * @param {string} productId
 * @returns {string}
 */
function getSlugFromProductId(productId) {
  return productId.split('_').slice(2).join('_')
}

/**
 * @param {unknown} products
 * @param {Object} [options]
 * @param {boolean} [options.isMesoRecommend]
 * @param {'story' | 'external'} [options.type]
 * @returns {Array<Record<string, any>>}
 */
function formatMisoRelatedStories(products, options = {}) {
  if (!Array.isArray(products)) {
    return []
  }

  const { isMesoRecommend = false, type = 'story' } = options

  return products.reduce((formattedStories, product) => {
    if (typeof product?.product_id !== 'string' || !product.product_id) {
      return formattedStories
    }

    const productId = product.product_id
    const relatedSlug = getSlugFromProductId(productId)

    if (!relatedSlug) {
      return formattedStories
    }

    formattedStories.push({
      id: productId,
      slug: relatedSlug,
      title: product.title || '',
      url: product.url || `/${type}/${relatedSlug}`,
      type,
      heroImage: product.cover_image
        ? {
            resized: { original: product.cover_image },
          }
        : null,
      brief: { blocks: [{ text: '' }] },
      categories: [],
      sections: [],
      ...(isMesoRecommend && { isMesoRecommend: true }),
    })

    return formattedStories
  }, [])
}

export { formatMisoRelatedStories }
