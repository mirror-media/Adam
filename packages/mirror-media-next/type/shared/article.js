export default {}

/**
 * @typedef {import('./draft-js').Draft} Draft
 */

/**
 * @typedef {import('./gql/section').Section & {
 *  slug: String,
 *  name: String,
 * }} ArticleSection
 */

/**
 * @typedef {import('./gql/category').Category & {
 *  slug: String,
 *  name: String,
 * }} ArticleCategory
 */

/**
 * @typedef {import('./gql/photo').ImageFile & {
 *  width: Number,
 *  height: Number,
 * }} HeroImageFile
 */

/**
 * @typedef {import('./gql/photo').Resized & {
 *  original: String,
 *  w480: String,
 *  w800: String,
 *  w1200: String,
 *  w1600: String,
 *  w2400: String,
 * }} HeroImageResized
 */

/**
 * @typedef {import('./gql/photo').Photo & {
 *  id: String,
 *  name: String,
 *  imageFile: HeroImageFile,
 *  resized: HeroImageResized
 * }} ArticleHeroImage
 */

/**
 * @typedef {import('./gql/post').Post & {
 *  id: String,
 *  slug: String,
 *  title: String,
 *  publishDate: String,
 *  draft: Draft,
 *  categroies: ArticleCategory[],
 *  sections: ArticleSection[],
 *  heroImage: ArticleHeroImage,
 * }} Article
 */
