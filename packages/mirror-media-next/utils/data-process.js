/**
 * @typedef {import('./api/index').fetchHeaderDataInDefaultPageLayout} fetchHeaderDataInDefaultPageLayout
 * @typedef {import('./api/index').fetchHeaderDataInPremiumPageLayout} fetchHeaderDataInPremiumPageLayout
 * @typedef {import('./api/index').HeadersData} HeadersData
 * @typedef {import('./api/index').Topics} Topics
 */

/**
 * @param {Awaited<ReturnType<fetchHeaderDataInDefaultPageLayout>> | undefined} headerData
 * @returns {[HeadersData, Topics]}
 */
const getSectionAndTopicFromDefaultHeaderData = (headerData) => {
  /** @type {HeadersData} */
  let sectionData = []
  /** @type {Topics} */
  let topicsData = []

  if (headerData) {
    if (Array.isArray(headerData['sectionsData']))
      sectionData = headerData['sectionsData']
    if (Array.isArray(headerData['topicsData']))
      topicsData = headerData['topicsData']
  }

  return [sectionData, topicsData]
}

/**
 * @param {Awaited<ReturnType<fetchHeaderDataInPremiumPageLayout>> | undefined} headerData
 * @returns {HeadersData}
 */
const getSectionFromPremiumHeaderData = (headerData) => {
  /** @type {HeadersData} */
  let sectionData = []

  if (headerData) {
    if (Array.isArray(headerData['sectionsData']))
      sectionData = headerData['sectionsData']
  }

  return sectionData
}

/**
 * @template T
 * @param {import('@apollo/client').ApolloQueryResult<any> | undefined} gqlData
 * @returns {[number, T[]]}
 */
const getPostsAndPostscountFromGqlData = (gqlData) => {
  if (!gqlData) {
    return [0, []]
  }

  const data = gqlData.data
  const postsCount = data?.postsCount || 0
  const posts = data?.posts || []
  return [postsCount, posts]
}

export {
  getSectionAndTopicFromDefaultHeaderData,
  getSectionFromPremiumHeaderData,
  getPostsAndPostscountFromGqlData,
}
