export default {}

/**
 * @typedef {import('../shared/gql/section').Section & {
 *  id: String,
 *  name: String,
 *  slug: String,
 * }} CategorySection
 */

/**
 * @typedef {import('../shared/gql/category').Category & {
 *  id: String,
 *  name: String,
 *  slug: String,
 *  sections: CategorySection,
 * }} Category
 */
