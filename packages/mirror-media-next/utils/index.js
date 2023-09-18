import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

/**
 * @typedef {import('../type/raw-data.typedef').RawData} RawData
 */

/**
 * @typedef {import('../apollo/fragments/section').Section[]} Sections
 */

/**
 * Get path of article base on different article style, and whether is external article.
 * @param {String} slug
 * @param {import('../type/raw-data.typedef').ArticleStyle} style
 * @param {Object |''} partner
 * @returns {String}
 */
const getArticleHref = (slug, style, partner) => {
  if (partner) {
    return `/external/${slug}/`
  }
  if (style === 'campaign') {
    return `/campaigns/${slug}`
  } else if (style === 'projects') {
    return `/projects/${slug}/`
  }
  /**
   * TODO: condition `isPremiumMember` is whether user is log in and is premium member,
   * We haven't migrate membership system yet, so remove this condition temporally.
   */
  // else if (isPremiumMember) {
  //   return `pre/story/${slug}/`
  // }

  return `/story/${slug}/`
}

/**
 * TODO: use typedef in `../apollo/fragments/section`
 * Should be done after fetch header data from new json file
 *
 * Get section name based on different condition
 * @param {import('../type/raw-data.typedef').Section[]} sections
 * @param {Object | ''} partner
 * @returns {String | undefined}
 */
function getSectionName(sections = [], partner = '') {
  if (partner) {
    return 'external'
  } else if (sections?.some((section) => section.name === 'member')) {
    return 'member'
  }
  return sections[0]?.name
}

/**
 * TODO: use typedef in `../apollo/fragments/section`
 * Should be done after fetch header data from new json file
 *
 * Get section title based on different condition
 * @param {import('../type/raw-data.typedef').Section[]} sections
 * @param {Object | ''} partner
 * @returns {String | undefined}
 */
function getSectionTitle(sections = [], partner) {
  if (partner) {
    if (partner.name === 'healthnews') {
      return '生活'
    } else if (partner.name === 'ebc') {
      return '時事'
    } else {
      return '時事'
    }
  }

  if (sections.length > 0) {
    if (sections.some((section) => section.name === 'member')) {
      return '會員專區'
    } else {
      return sections[0]?.title
    }
  }
  return undefined
}

//TODO:
// - remove function for handling data from k3 server
// - adjust typedef of Section

/**
 * Get section slug based on different condition
 * @param {Sections} sections
 * @param {Object | ''} partner
 * @returns {String | undefined}
 */
function getSectionSlugGql(sections = [], partner = '') {
  if (partner) {
    return 'external'
  } else if (sections?.some((section) => section.slug === 'member')) {
    return 'member'
  }
  return sections[0]?.slug
}

/**
 * Get section name based on different condition
 * @param {Sections} sections
 * @param {Object | ''} partner
 * @returns {String | undefined}
 */
function getSectionNameGql(sections = [], partner) {
  if (partner) {
    if (partner.slug === 'healthnews') {
      return '生活'
    } else if (partner.slug === 'ebc') {
      return '時事'
    } else {
      return '時事'
    }
  }

  if (sections.length > 0) {
    if (sections.some((section) => section.slug === 'member')) {
      return '會員專區'
    } else {
      return sections[0]?.name
    }
  }
  return undefined
}
/**
 * Transform the item in the array into a specific data structure, which will be applied to a specific list page
 * @param {RawData[]} rawData
 * @returns {import('../type/index').ArticleInfoCard[]}
 */
const transformRawDataToArticleInfo = (rawData) => {
  return rawData?.map((article) => {
    const {
      slug = '',
      title = '',
      heroImage = {
        image: { resizedTargets: { mobile: { url: '' }, tablet: { url: '' } } },
      },
      sections = [],
      partner = {},
      style,
    } = article || {}

    const { mobile = {}, tablet = {} } = heroImage?.image
      ? heroImage?.image?.resizedTargets
      : {}
    return {
      title,
      slug,
      href: getArticleHref(slug, style, partner),
      imgSrcMobile: mobile?.url || '/images-next/default-og-img.png',
      imgSrcTablet: tablet?.url || '/images-next/default-og-img.png',
      sectionTitle: getSectionTitle(sections, partner),
      sectionName: getSectionName(sections, partner),
    }
  })
}

/**
 * Transform params `time` into different pattern
 * depend on the type 'dot' or 'slash' or 'slashWithTime'
 * If `time` is not a valid date, this function will return undefined
 * @param {string} time
 * @param {'dot' | 'slash'| 'slashWithTime'} format
 * @returns {string | undefined}
 */
const transformTimeData = (time, format) => {
  dayjs.extend(utc)

  const timeData = dayjs(time).utcOffset(8)

  if (!timeData.isValid()) {
    return undefined
  } else {
    switch (format) {
      case 'dot':
        return timeData.format('YYYY.MM.DD HH:mm')

      case 'slash':
        return timeData.format('YYYY/MM/DD')

      case 'slashWithTime':
        return timeData.format('YYYY/MM/DD HH:mm')

      default:
        return undefined
    }
  }
}

/**
 * Transform params `time` into `YYYY.MM.DD HH:MM` pattern
 * If `time` is not a valid date, this function will return undefined
 * @param {String} time
 * @returns {string | undefined}
 */
const transformTimeDataIntoDotFormat = (time) => {
  return transformTimeData(time, 'dot')
}

/**
 * Transform params `time` into `YYYY/MM/DD HH:MM` pattern
 * If `time` is not a valid date, this function will return undefined
 * @param {String} time
 * @param {boolean} includeTime - Whether to include time or not. Default is true.
 * @returns {string | undefined}
 */
const transformTimeDataIntoSlashFormat = (time, includeTime = true) => {
  const format = includeTime ? 'slashWithTime' : 'slash'
  return transformTimeData(time, format)
}

//TODO: add more specific type in param `arrayNeedToSort` and `arraySortReference`
/**
 * Sorts an array of objects based on the order of ids in another array of objects.
 * @param {Object[]} arrayNeedToSort
 * @param {Object[]} arraySortReference
 */
const sortArrayWithOtherArrayId = (arrayNeedToSort, arraySortReference) => {
  const sortedArray = arrayNeedToSort.slice().sort((a, b) => {
    const aIndex = arraySortReference.findIndex((x) => x.id === a.id)
    const bIndex = arraySortReference.findIndex((x) => x.id === b.id)
    return aIndex - bIndex
  })
  return sortedArray
}

/**
Get the magazine href from a given slug.
@param {string} slug 
@returns {string} 
*/
const getMagazineHrefFromSlug = (slug) => {
  const issue = slug.match(/\d+/)[0]
  const book = slug.endsWith('A本') ? 'A' : 'B'
  const href = `/magazine/Book_${book}/${book}${issue}-Publish`
  return href
}

/**
 * @typedef {import('../apollo/fragments/category').Category} Category - category information
 */

/**
 * array of categories with the slug 'wine' or 'wine1'.
 * @param {Pick<Category, 'id' | 'name' | 'slug'>[]} categories - certain category information
 * @returns {Pick<Category, 'id' | 'name' | 'slug'>[] | []}
 */
const getCategoryOfWineSlug = (categories) => {
  if (Array.isArray(categories)) {
    return categories.filter(
      (category) => category.slug === 'wine' || category.slug === 'wine1'
    )
  }
  return []
}

/**
 * Convert the `text` content in `rawContentBlock` data (h2, h3, unstyled)
 * and combine the first 160 characters as a plain text description for `og-description`.
 * @param {import('../type/draft-js').Draft} rawContentBlock
 * @returns {string | undefined}
 */
const convertDraftToText = (rawContentBlock) => {
  if (
    rawContentBlock &&
    rawContentBlock?.blocks &&
    rawContentBlock.blocks.length > 0
  ) {
    const text = rawContentBlock.blocks.map((block) => block.text).join('')

    const ogDescription =
      text && text.length > 160
        ? text.trim().slice(0, 160) + '...'
        : text.trim()

    return ogDescription
  } else {
    return undefined
  }
}

/**
 * To get the URL link for `og-image`, sorted in ascending order based on file size.
 * Skip w480 to prevent image size minimum 200 x 200.
 * @param {import('../apollo/fragments/photo').Resized | undefined | null} resized
 * @returns {string | undefined}
 */
const getResizedUrl = (resized) => {
  if (resized) {
    return (
      resized?.w800 ||
      resized?.w1200 ||
      resized?.w1600 ||
      resized?.w2400 ||
      resized?.original
    )
  } else {
    return undefined
  }
}

/**
 * Returns a string representation of a number with commas as thousand separators.
 *
 * @param {number} num - The number to convert to a string with commas.
 * @return {string} The string representation of the number with commas.
 */
const getNumberWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Return sections that are in `active` state and sorted.
 *
 * @property {Sections} sections
 * @property {Sections} sectionsInInputOrder
 * @return {Sections}
 */
const getActiveOrderSection = (sections, sectionsInInputOrder) => {
  /**
   * Because `sections` can be filtered by `where` in GraphQL based on whether `state` is active,
   * but `sectionsInInputOrder` doesn't have `where`.
   *
   * Need to filter state of `sectionsInInputOrder` to match the results of sections.
   */
  const activeSectionsOrder = Array.isArray(sectionsInInputOrder)
    ? sectionsInInputOrder.filter((section) => section.state === 'active')
    : []

  /**
   * Although `sections` already filter `state` at GraphQL ,
   * for the sake of maintaining same logic between `sectionsInInputOrder` and `sections`,
   * filter `state` status of `sections` again.
   * */
  const activeSections = Array.isArray(sections)
    ? sections.filter((section) => section.state === 'active')
    : []

  if (activeSectionsOrder.length > 0) {
    return activeSectionsOrder
  } else if (activeSections.length > 0) {
    return activeSections
  } else {
    return []
  }
}

export {
  transformRawDataToArticleInfo,
  transformTimeDataIntoDotFormat,
  transformTimeDataIntoSlashFormat,
  getSectionNameGql,
  getSectionSlugGql,
  getArticleHref,
  sortArrayWithOtherArrayId,
  getMagazineHrefFromSlug,
  getCategoryOfWineSlug,
  convertDraftToText,
  getResizedUrl,
  getNumberWithCommas,
  getActiveOrderSection,
}
