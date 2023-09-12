import client from '../../apollo/apollo-client'
import { fetchExternals } from '../../apollo/query/externals'

/**
 * @typedef {import('../../apollo/fragments/external').ListingExternal} ListingExternal
 */

/**
 * @typedef {import('@apollo/client').ApolloQueryResult<{externals: ListingExternal[]}>} ExternalsQueryResult
 */

/**
 * @callback FetchExternalsByPartnerSlug
 * @param {number} page
 * @param {number} renderPageSize
 * @param {string | string[]} [partnerSlug]
 * @returns {Promise<ListingExternal[]>}
 */

/**
 * @callback FetchExternalsWhichPartnerIsNotShowOnIndex
 * @param {number} page
 * @param {number} renderPageSize
 * @returns {Promise<ListingExternal[]>}
 */

/**
 * @type {FetchExternalsByPartnerSlug}
 */
const fetchExternalsByPartnerSlug = async (
  page,
  renderPageSize,
  partnerSlug
) => {
  const partnerSlugForFetch = Array.isArray(partnerSlug)
    ? partnerSlug[0]
    : partnerSlug
  try {
    /**
     * @type {ExternalsQueryResult}
     */
    const response = await client.query({
      query: fetchExternals,
      variables: {
        take: renderPageSize * 2,
        skip: (page - 1) * renderPageSize * 2,
        orderBy: { publishedDate: 'desc' },
        filter: {
          state: { equals: 'published' },
          partner: { slug: { equals: partnerSlugForFetch } },
        },
      },
    })
    return response.data.externals
  } catch (error) {
    console.error(error)
  }
  return
}

/**
 * @type {FetchExternalsWhichPartnerIsNotShowOnIndex}
 */
const fetchExternalsWhichPartnerIsNotShowOnIndex = async (
  page,
  renderPageSize
) => {
  try {
    /**
     * @type {ExternalsQueryResult}
     */
    const response = await client.query({
      query: fetchExternals,
      variables: {
        take: renderPageSize * 2,
        skip: (page - 1) * renderPageSize * 2,
        orderBy: { publishedDate: 'desc' },
        filter: {
          state: { equals: 'published' },
          partner: { showOnIndex: { equals: false } },
        },
      },
    })
    return response.data.externals
  } catch (error) {
    console.error(error)
  }
  return
}

export {
  fetchExternalsByPartnerSlug,
  fetchExternalsWhichPartnerIsNotShowOnIndex,
}
