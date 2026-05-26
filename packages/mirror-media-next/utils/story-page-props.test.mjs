import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  getInitialRelatedStories,
  serializeStoryPostDataForClient,
} from './story-page-props.mjs'

const currentDir = dirname(fileURLToPath(import.meta.url))

const image = {
  __typename: 'Photo',
  resized: {
    original: 'https://example.com/image.jpg',
    w480: 'https://example.com/image-w480.jpg',
    w800: '',
    w1600: 'https://example.com/image-w1600.jpg',
  },
  resizedWebp: {
    original: 'https://example.com/image.webP',
    w480: '',
    w800: 'https://example.com/image-w800.webP',
  },
}

const postData = {
  __typename: 'Post',
  slug: 'story-slug',
  content: { blocks: [{ text: 'full content' }], entityMap: {} },
  trimmedContent: { blocks: [{ text: 'trimmed content' }], entityMap: {} },
  relatedsOne: {
    __typename: 'Post',
    id: 'related-1',
    slug: 'related-one',
    title: 'Related one',
    heroImage: image,
    brief: { blocks: [{ text: 'not needed' }], entityMap: {} },
  },
  relatedsTwo: {
    __typename: 'External',
    id: 'related-2',
    slug: 'related-two',
    title: 'Related two',
    heroImage: image,
    categories: [{ name: 'not needed' }],
  },
  relateds: [
    {
      __typename: 'Post',
      id: 'related-3',
      slug: 'related-three',
      title: 'Related three',
      heroImage: image,
      sections: [{ name: 'not needed' }],
    },
  ],
  relatedsInInputOrder: [],
}

const clientPostData = serializeStoryPostDataForClient(postData)

assert.equal(clientPostData.__typename, undefined)
assert.equal(clientPostData.trimmedContent, undefined)
assert.equal(clientPostData.relateds, undefined)
assert.equal(clientPostData.relatedsOne, undefined)
assert.equal(clientPostData.relatedsTwo, undefined)
assert.equal(clientPostData.relatedsInInputOrder, undefined)
assert.equal(
  serializeStoryPostDataForClient({
    trimmedContent: { blocks: [{ text: 'trimmed content' }], entityMap: {} },
  }).trimmedContent,
  undefined
)

const initialRelatedStories = getInitialRelatedStories(postData)

assert.deepEqual(
  initialRelatedStories.map(({ id, slug, title, type, url }) => ({
    id,
    slug,
    title,
    type,
    url,
  })),
  [
    {
      id: 'related-1',
      slug: 'related-one',
      title: 'Related one',
      type: 'story',
      url: '/story/related-one',
    },
    {
      id: 'related-2',
      slug: 'related-two',
      title: 'Related two',
      type: 'external',
      url: '/external/related-two',
    },
    {
      id: 'related-3',
      slug: 'related-three',
      title: 'Related three',
      type: 'story',
      url: '/story/related-three',
    },
  ]
)
assert.equal(initialRelatedStories[0].brief, undefined)
assert.equal(initialRelatedStories[0].heroImage.__typename, undefined)
assert.equal(initialRelatedStories[0].heroImage.resized.w800, undefined)
assert.equal(
  initialRelatedStories[0].heroImage.resized.w1600.endsWith('.jpg'),
  true
)
assert.equal(initialRelatedStories[0].heroImage.resizedWebp.w480, undefined)

const assertNoUndefinedValues = (value) => {
  if (Array.isArray(value)) {
    value.forEach(assertNoUndefinedValues)
    return
  }

  if (!value || typeof value !== 'object') {
    return
  }

  Object.entries(value).forEach(([key, child]) => {
    assert.notEqual(child, undefined, `${key} should not be undefined`)
    assertNoUndefinedValues(child)
  })
}

assertNoUndefinedValues(clientPostData)
assertNoUndefinedValues(initialRelatedStories)

const postQuerySource = readFileSync(
  join(currentDir, '../apollo/query/posts.js'),
  'utf8'
)
const postFragmentSource = readFileSync(
  join(currentDir, '../apollo/fragments/post.js'),
  'utf8'
)
const photoFragmentSource = readFileSync(
  join(currentDir, '../apollo/fragments/photo.js'),
  'utf8'
)
const cacheSettingSource = readFileSync(
  join(currentDir, './cache-setting.js'),
  'utf8'
)

assert.match(postQuerySource, /const fetchStoryPostBySlug = gql`/)
assert.match(postQuerySource, /const fetchAmpPostBySlug = gql`/)
assert.doesNotMatch(
  postQuerySource.match(/const fetchStoryPostBySlug = gql`[\s\S]*?`\n/)?.[0] ??
    '',
  /postTrimmedContent|trimmedContent/
)
assert.match(
  postQuerySource.match(/const fetchAmpPostBySlug = gql`[\s\S]*?`\n/)?.[0] ??
    '',
  /postTrimmedContent/
)
assert.match(postFragmentSource, /fragment relatedPost on Post/)
assert.doesNotMatch(
  postFragmentSource.match(/export const relatedPost = gql`[\s\S]*?`\n/)?.[0] ??
    '',
  /\.\.\.heroImage/
)
const heroImageFragment =
  photoFragmentSource.match(/export const heroImage = gql`[\s\S]*?`\n/)?.[0] ??
  ''
const relatedPostHeroImageFragment =
  photoFragmentSource.match(
    /export const relatedPostHeroImage = gql`[\s\S]*?`\n/
  )?.[0] ?? ''
const postFragment =
  postFragmentSource.match(/export const post = gql`[\s\S]*?`\n/)?.[0] ?? ''

assert.match(heroImageFragment, /resized\s*{\s*original\s*}/)
assert.doesNotMatch(heroImageFragment, /w480|w800|w1200|w1600|w2400/)
assert.doesNotMatch(heroImageFragment, /resizedWebp/)
assert.match(relatedPostHeroImageFragment, /resized\s*{\s*original\s*}/)
assert.doesNotMatch(relatedPostHeroImageFragment, /w480|w800|w1200|w1600|w2400/)
assert.doesNotMatch(relatedPostHeroImageFragment, /resizedWebp/)
assert.match(postFragment, /og_image\s*{\s*resized\s*{\s*original\s*}/)
assert.doesNotMatch(
  postFragment.match(/og_image\s*{[\s\S]*?}\s*}/)?.[0] ?? '',
  /w1600/
)

assert.match(cacheSettingSource, /case 'no-store':\s*case 'no-cache':/)
assert.doesNotMatch(
  cacheSettingSource.match(/case 'no-store':[\s\S]*?break/)?.[0] ?? '',
  /cacheTime/
)
