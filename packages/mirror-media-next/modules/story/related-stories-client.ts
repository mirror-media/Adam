import { getRelatedStories } from '@/utils/api/recommendation'

import type { RelatedStory } from './story-types'

/**
 * Client-safe: only calls the MISO recommendation API over `fetch`. Kept out
 * of `story-data.ts` so the browser bundle for `use-load-more-related-stories`
 * never pulls in that module's server-only (Node `fs`) data fetching.
 */
export async function fetchAdditionalRelatedStories(
  slug: string,
  currentRelatedStories: RelatedStory[],
  takeCount: number
): Promise<RelatedStory[]> {
  const filterIds = currentRelatedStories.map(
    (story) => `mirrormedia_story_${story.slug}`
  )

  try {
    const result = await getRelatedStories(slug, filterIds, takeCount, 'story')

    if (!result || !('data' in result) || !result.data?.products) {
      return []
    }

    return result.data.products.map((product): RelatedStory => {
      const relatedSlug = product.product_id.split('_').slice(2).join('_')

      return {
        id: product.product_id,
        slug: relatedSlug,
        title: product.title || '',
        url: product.url || `/story/${relatedSlug}`,
        type: 'story',
        heroImage: product.cover_image
          ? { resized: { original: product.cover_image } }
          : null,
        isMesoRecommend: true,
      }
    })
  } catch (error) {
    console.error('Failed to fetch MISO related stories:', error)
    return []
  }
}
