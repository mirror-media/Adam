import { buildMisoUrl, formatStoryId, misoFetch } from '../../utils/miso'
import { MISO_ENDPOINTS } from '../../config/index.mjs'

/**
 * @typedef {import('../../type/miso').RelatedStoriesResponse} RelatedStoriesResponse
 */

/**
 * @param {string} storyId
 * @param {string[]} filterIds
 * @param {number} takeCount
 * @param {string} storyType
 * @returns {Promise<any>}
 */
export async function getRelatedStories(
  storyId,
  filterIds,
  takeCount = 4,
  storyType
) {
  const url = buildMisoUrl(MISO_ENDPOINTS.relatedStories)

  // NOTE: miso ai use mesh_story prefix to search so ensure the story id is in right format.
  const formattedStoryId = formatStoryId(storyId, storyType)

  /**
   * miso does not index dev database
   * so if you are test in dev enviroment,
   * it is normal to be undefined.
   *
   * BTW, if you are not sure, use curl or postman:
   * ```bash
   * curl --location 'https://api.askmiso.com/v1/recommendation/product_to_products?api_key=IHtn9b9tfPsO1EQpGV74OMf2syhELb6XVZe8u9FT' \
   *      --header 'Content-Type: application/json' \
   *       --data '{
   *           "product_ids": [
   *               "mesh_story_172347"
   *           ],
   *           "anonymous_id": "test",
   *           "fq": "product_id:/mesh_story_.+/",
   *           "fl": [
   *               "title",
   *               "url",
   *               "cover_image"
   *           ]
   *       }
   * ```
   */

  let filterQuery = `product_id:/mirrormedia_${storyType}_.*/`

  if (filterIds && filterIds.length > 0) {
    // 使用 Solr 語法排除特定 ID
    const excludeConditions = filterIds.map((id) => `-product_id:${id}`)
    filterQuery = `${filterQuery} AND (${excludeConditions.join(' AND ')})`
  }

  const defaultParams = {
    product_ids: [formattedStoryId],
    anonymous_id: 'mirrormedia_related_stories',
    rows: takeCount,
    fq: filterQuery,
    fl: ['title', 'url', 'cover_image'],
  }

  try {
    const response = await misoFetch(url, defaultParams)
    const result = await response.json()

    // Basic validation
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid response format from related stories API')
    }

    return result
  } catch (err) {
    console.error(err)
    return []
  }
}
