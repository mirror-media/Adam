import { getRelatedStories } from '@/utils/api/recommendation'

import type { ExternalPost, ExternalRelatedStory } from './external-types'

/**
 * `external.relateds` points to internal story posts, so each item should
 * navigate to `/story/${item.slug}`.
 */
export function initializeExternalRelatedStories(
  relateds: ExternalPost['relateds']
): ExternalRelatedStory[] {
  return (relateds ?? [])
    .filter((item): item is NonNullable<typeof item> => item != null)
    .map((item) => ({
      ...item,
      id: item.id ?? '',
      slug: item.slug ?? '',
      title: item.title ?? '',
      url: `/story/${item.slug ?? ''}`,
      type: 'story',
    }))
}

/**
 * Client-safe: only calls the MISO recommendation API over `fetch`. Kept out
 * of `external-data.ts` so the browser bundle never pulls in that module's
 * server-only (Node `fs`) data fetching.
 */
export async function fetchAdditionalExternalRelatedStories(
  slug: string,
  takeCount: number
): Promise<ExternalRelatedStory[]> {
  try {
    const result = await getRelatedStories(slug, [], takeCount, 'external')

    if (!result || !('data' in result) || !result.data?.products) {
      return []
    }

    return result.data.products.map((product): ExternalRelatedStory => {
      const relatedSlug = product.product_id.split('_').slice(2).join('_')

      return {
        id: product.product_id,
        slug: relatedSlug,
        title: product.title || '',
        url: product.url || `/external/${relatedSlug}`,
        type: 'external',
        heroImage: product.cover_image
          ? { resized: { original: product.cover_image } }
          : null,
        brief: { blocks: [{ text: '' }] },
        categories: [],
        sections: [],
      }
    })
  } catch (error) {
    console.error('Failed to fetch MISO related external stories:', error)
    return []
  }
}
