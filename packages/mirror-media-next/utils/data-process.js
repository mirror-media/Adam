/**
 * @typedef {import('./api/index').fetchHeaderDataInDefaultPageLayout} fetchHeaderDataInDefaultPageLayout
 * @typedef {import('./api/index').HeadersData} HeadersData
 * @typedef {import('./api/index').ShellFlashNews} ShellFlashNews
 * @typedef {import('./api/index').Topics} Topics
 */

/**
 * @param {Awaited<ReturnType<fetchHeaderDataInDefaultPageLayout>> | undefined} headerData
 * @returns {[HeadersData, Topics, ShellFlashNews[]]}
 */
const getSectionAndTopicFromDefaultHeaderData = (headerData) => {
  /** @type {HeadersData} */
  let sectionData = []
  /** @type {Topics} */
  let topicsData = []
  /** @type {ShellFlashNews[]} */
  let flashNewsData = []

  if (headerData) {
    if (Array.isArray(headerData['sectionsData']))
      sectionData = headerData['sectionsData']
    if (Array.isArray(headerData['topicsData']))
      topicsData = headerData['topicsData']
    if (Array.isArray(headerData['flashNewsData']))
      flashNewsData = headerData['flashNewsData']
  }

  return [sectionData, topicsData, flashNewsData]
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
  getPostsAndPostscountFromGqlData,
  getSectionAndTopicFromDefaultHeaderData,
}
