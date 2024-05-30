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
 * @returns {Promise<ExternalsQueryResult>}
 */

/**
 * @callback FetchExternalsWhichPartnerIsNotShowOnIndex
 * @param {number} page
 * @param {number} renderPageSize
 * @returns {Promise<ExternalsQueryResult>}
 */

/**
 * @type {FetchExternalsByPartnerSlug}
 */
const fetchExternalsByPartnerSlug = (page, renderPageSize, partnerSlug) => {
  const partnerSlugForFetch = Array.isArray(partnerSlug)
    ? partnerSlug[0]
    : partnerSlug
  return client.query({
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
}

/**
 * @type {FetchExternalsWhichPartnerIsNotShowOnIndex}
 */
const fetchExternalsWhichPartnerIsNotShowOnIndex = (page, renderPageSize) => {
  return client.query({
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
}

export {
  fetchExternalsByPartnerSlug,
  fetchExternalsWhichPartnerIsNotShowOnIndex,
}
