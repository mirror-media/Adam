export default {}

//section and topic

/**
 * @typedef {Object} BasicInfo - info of certain category/section/topic
 * @property {string} _id - id
 * @property {string} title - chinese name of category/section/topic
 * @property {string} name - english name of category/section/topic
 */

/**
 * @typedef {Object} CategoryType
 * @property {boolean} isMemberOnly - whether this category belongs to the members area
 *
 * @typedef {BasicInfo & CategoryType} Category
 */

/**
 * @typedef {Object} SectionType
 * @property {boolean} isFeatured - if true, should be selected and render
 * @property {Category[]} categories - categories which belong to certain section
 *
 * @typedef {BasicInfo & SectionType} Section
 */

/**
 * @typedef {BasicInfo & {isFeatured: boolean} } Topic
 */

/**
 * @typedef {Object} SubBrand - Sub-brand belonging to Mirror Media, which propose is direct users to certain website of sub-brand
 * @property {string} name - English name of sub-brand
 * @property {string} title - Mandarin name of sub-brand
 * @property {string} href - Complete url of sub-brand
 */

/**
 * @typedef {Object} Promotion - promotion link, which propose is direct users to specific pages
 * @property {string} name - English name of promotion link
 * @property {string} title - Mandarin name of promotion link
 * @property {string} href - Url of promotion link
 */

/**
 * @typedef {Object} SocialMedia - Info of Social Media Service (SNS) belonging to Mirror Media
 * @property {string} name - English name of SNS
 * @property {string} href - Url of SNS
 */

/**
 * @typedef {Object} FlashNews - info of certain flash news
 * @property {string} title - title of flash news
 * @property {string} href - path of flash news
 * @property {string} slug - slug of flash news
 */
