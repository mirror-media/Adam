import assert from 'node:assert/strict'
import {
  buildResizedImagesFromOriginal,
  buildResizedWebPImagesFromOriginal,
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

assert.deepEqual(normalizeImageForRender(null), null)
