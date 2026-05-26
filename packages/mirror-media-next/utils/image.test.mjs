import assert from 'node:assert/strict'
import {
  buildResizedImagesFromOriginal,
  buildResizedWebPImagesFromOriginal,
  compactImageForClientPayload,
  compactListingImagePayload,
  getResizedUrl,
  normalizeImageForRender,
} from './image.mjs'

const original =
  'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8.jpg'

assert.deepEqual(buildResizedImagesFromOriginal(original), {
  original,
  w480: 'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8-w480.jpg',
  w800: 'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8-w800.jpg',
  w1200:
    'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8-w1200.jpg',
  w1600:
    'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8-w1600.jpg',
  w2400:
    'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8-w2400.jpg',
})

assert.deepEqual(
  buildResizedWebPImagesFromOriginal(`${original}?token=abc#section`),
  {
    original:
      'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8.webP?token=abc#section',
    w480: 'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8-w480.webP?token=abc#section',
    w800: 'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8-w800.webP?token=abc#section',
    w1200:
      'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8-w1200.webP?token=abc#section',
    w1600:
      'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8-w1600.webP?token=abc#section',
    w2400:
      'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8-w2400.webP?token=abc#section',
  }
)

assert.equal(
  getResizedUrl({ original }),
  'https://v3-statics-dev.mirrormedia.mg/images/20230510165026-6b9df6813d6befc8f0e287646d13b6a8-w1600.jpg'
)

assert.equal(
  getResizedUrl({
    original,
    w1600: 'https://example.com/known-w1600.jpg',
  }),
  'https://example.com/known-w1600.jpg'
)

assert.deepEqual(normalizeImageForRender({ resized: { original } }), {
  resized: buildResizedImagesFromOriginal(original),
  resizedWebp: buildResizedWebPImagesFromOriginal(original),
})

assert.deepEqual(normalizeImageForRender(original), {
  resized: buildResizedImagesFromOriginal(original),
  resizedWebp: buildResizedWebPImagesFromOriginal(original),
})

assert.deepEqual(normalizeImageForRender(null), null)

assert.deepEqual(
  compactImageForClientPayload({
    __typename: 'Photo',
    id: 'photo-id',
    resized: {
      __typename: 'Resized',
      original,
      w480: 'https://example.com/image-w480.jpg',
      w800: '',
    },
    resizedWebp: {
      __typename: 'ResizedWebp',
      original: 'https://example.com/image.webP',
      w480: 'https://example.com/image-w480.webP',
    },
  }),
  {
    id: 'photo-id',
    resized: {
      original,
    },
  }
)

assert.deepEqual(compactImageForClientPayload(original), original)

assert.deepEqual(
  compactListingImagePayload({
    __typename: 'ListingResponse',
    latest: [
      {
        __typename: 'Post',
        slug: 'story-slug',
        heroImage: {
          __typename: 'Photo',
          resized: {
            __typename: 'Resized',
            original,
            w480: 'https://example.com/image-w480.jpg',
          },
          resizedWebp: {
            original: 'https://example.com/image.webP',
          },
        },
        og_image: {
          resized: {
            original: 'https://example.com/og.jpg',
            w1600: 'https://example.com/og-w1600.jpg',
          },
          resizedWebp: {
            original: 'https://example.com/og.webP',
          },
        },
      },
      {
        slug: 'external-slug',
        heroImage: 'https://partner.example.com/image.jpg',
      },
    ],
  }),
  {
    latest: [
      {
        slug: 'story-slug',
        heroImage: {
          resized: {
            original,
          },
        },
        og_image: {
          resized: {
            original: 'https://example.com/og.jpg',
          },
        },
      },
      {
        slug: 'external-slug',
        heroImage: 'https://partner.example.com/image.jpg',
      },
    ],
  }
)
