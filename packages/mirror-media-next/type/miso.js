/**
 * @typedef {Object} MisoProduct
 * @property {string} product_id
 * @property {string} [title]
 * @property {string} [url]
 * @property {string} [cover_image]
 * @property {boolean} [_boosted]
 * @property {Array<any>} _order_by
 */

/**
 * @typedef {Object} MisoData
 * @property {number} took
 * @property {string} miso_id
 * @property {MisoProduct[]} products
 */

/**
 * @typedef {Object} RelatedStoriesResponse
 * @property {string} message
 * @property {MisoData} data
 */

export {}
