import assert from 'node:assert/strict'
import { formatMisoRelatedStories } from './miso-related-stories.mjs'

assert.deepEqual(
  formatMisoRelatedStories(
    [
      {
        product_id: 'mirrormedia_story_valid_slug',
        title: 'Valid story',
        url: 'https://www.mirrormedia.mg/story/valid_slug',
        cover_image: 'https://example.com/image.jpg',
      },
      null,
      undefined,
      { product_id: undefined },
      { product_id: 123 },
      { product_id: '' },
    ],
    { isMesoRecommend: true, type: 'story' }
  ),
  [
    {
      id: 'mirrormedia_story_valid_slug',
      slug: 'valid_slug',
      title: 'Valid story',
      url: 'https://www.mirrormedia.mg/story/valid_slug',
      type: 'story',
      heroImage: {
        resized: {
          original: 'https://example.com/image.jpg',
        },
      },
      brief: { blocks: [{ text: '' }] },
      categories: [],
      sections: [],
      isMesoRecommend: true,
    },
  ]
)

assert.deepEqual(
  formatMisoRelatedStories([{ product_id: 'm_m_external' }], {
    type: 'external',
  }),
  [
    {
      id: 'm_m_external',
      slug: 'external',
      title: '',
      url: '/external/external',
      type: 'external',
      heroImage: null,
      brief: { blocks: [{ text: '' }] },
      categories: [],
      sections: [],
    },
  ]
)

assert.deepEqual(formatMisoRelatedStories(null), [])
assert.deepEqual(formatMisoRelatedStories({ products: [] }), [])
