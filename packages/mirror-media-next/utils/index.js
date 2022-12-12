/**
 * @typedef {import('../type/raw-data.typedef').RawData} RawData
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

/**
 * Transform the item in the array into a specific data structure, which will be applied to a specific list page
 * @param {RawData[]} rawData
 * @returns {Object[]}
 */
const transformRawDataToArticleInfo = (rawData) => {
  return rawData.map((article) => {
    const {
      slug = '',
      title = '',
      heroImage,
      sections,
      partner,
      style,
    } = article

    const { mobile = {}, tablet = {} } = heroImage?.image
      ? heroImage?.image?.resizedTargets
      : {}
    return {
      title,
      slug,
      href: getArticleHref(slug, style, partner),
      imgSrcMobile: mobile?.url || '/images/default-og-img.png',
      imgSrcTablet: tablet?.url || '/images/default-og-img.png',
      sectionTitle: getSectionTitle(sections, partner),
      sectionName: getSectionName(sections, partner),
    }
  })
}

export { transformRawDataToArticleInfo }
