import { MISO_ENDPOINTS } from '../../config/index.mjs'
import { buildMisoUrl, formatStoryId, misoFetch } from '../../utils/miso'

/**
 * @typedef {import('../../type/miso').RelatedStoriesResponse} RelatedStoriesResponse
 */

/**
 * @param {string} storySlug
 * @param {string[]} filterIds
 * @param {number} takeCount
 * @param {string} storyType
 * @returns {Promise<any>}
 */
export async function getRelatedStories(
  storySlug,
  filterIds,
  takeCount = 4,
  storyType
) {
  const url = buildMisoUrl(MISO_ENDPOINTS.relatedStories)

  // NOTE: miso ai use mesh_story prefix to search so ensure the story id is in right format.
  const formattedStoryId = formatStoryId(storySlug, storyType)

  /**
   * miso does not index dev database
   * so if you are test in dev enviroment,
   * it is normal to be undefined.
   *
   * BTW, if you are not sure, use curl or postman:
   * ```bash
    curl --location 'https://api.askmiso.com/v1/recommendation/product_to_products?api_key=IHtn9b9tfPsO1EQpGV74OMf2syhELb6XVZe8u9FT' \
         --header 'Content-Type: application/json' \
          --data '{
              "product_ids": [
                  "mirrormedia_story_20250818edi044"
              ],
              "anonymous_id": "test",
              "fq": ""product_id:/mirrormedia_story_.+/ AND (-product_id:mirrormedia_story_20250818edi008 AND -product_id:mirrormedia_story_20250817edi023 AND -product_id:mirrormedia_story_20250818edi038 AND -product_id:mirrormedia_story_20250818edi004 AND -product_id:mirrormedia_story_20250818edi009)",
              "fl": [
                  "title",
                  "url",
                  "cover_image"
              ]
          }'
   * ```
   */

  let filterQuery = `product_id:/mirrormedia_${storyType}_.+/`

  if (filterIds && filterIds.length > 0) {
    const excludeConditions = filterIds.map((id) => {
      const escapedId = formatStoryId(id, storyType)
      return `-product_id:${escapedId}`
    })
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
