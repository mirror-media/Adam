import client from '../../apollo/apollo-client'
import { fetchExternals } from '../../apollo/query/externals'

const fetchExternalsByPartnerSlug = (
  page: number,
  renderPageSize: number,
  partnerSlug?: string | string[]
) => {
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

const fetchExternalsWhichPartnerIsNotShowOnIndex = (
  page: number,
  renderPageSize: number
) => {
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

export type FetchExternalsByPartnerSlug = typeof fetchExternalsByPartnerSlug
export type FetchExternalsWhichPartnerIsNotShowOnIndex =
  typeof fetchExternalsWhichPartnerIsNotShowOnIndex
export type ExternalsQueryResult = Awaited<
  ReturnType<FetchExternalsByPartnerSlug>
>

export {
  fetchExternalsByPartnerSlug,
  fetchExternalsWhichPartnerIsNotShowOnIndex,
}
