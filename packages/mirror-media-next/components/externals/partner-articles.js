import styled from 'styled-components'
import client from '../../apollo/apollo-client'

import InfiniteScrollList from '../infinite-scroll-list'
import Image from 'next/legacy/image'
import LoadingPage from '../../public/images/loading_page.gif'
import ExternalList from './externals-list'
import { fetchExternalsByPartnerSlug } from '../../apollo/query/externals'

const Loading = styled.div`
  margin: 20px auto 0;
  padding: 0 0 20px;
  text-align: center;

  ${({ theme }) => theme.breakpoint.xl} {
    margin: 64px auto 0;
    padding: 0 0 64px;
  }
`

/**
 * @typedef {import('../../apollo/fragments/external').ListingExternal} ListingExternal
 * @typedef {import('../../apollo/fragments/partner').Partner} Partner
 */

/**
 *
 * @param {Object} props
 * @param {number} props.externalsCount
 * @param {ListingExternal[]} props.externals
 * @param {Partner} props.partner
 * @param {number} props.renderPageSize
 * @returns {React.ReactElement}
 */
export default function ExternalArticles({
  externalsCount,
  externals,
  partner,
  renderPageSize,
}) {
  async function fetchExternalsFromPage(page) {
    try {
      const response = await client.query({
        query: fetchExternalsByPartnerSlug,
        variables: {
          take: renderPageSize * 2,
          skip: (page - 1) * renderPageSize * 2,
          orderBy: { publishedDate: 'desc' },
          filter: {
            state: { equals: 'published' },
            partner: { slug: { equals: partner.slug } },
          },
        },
      })
      return response.data.externals
    } catch (error) {
      console.error(error)
    }
    return
  }

  const loader = (
    <Loading key={0}>
      <Image src={LoadingPage} alt="loading page"></Image>
    </Loading>
  )

  return (
    <InfiniteScrollList
      initialList={externals}
      renderAmount={renderPageSize}
      fetchCount={Math.ceil(externalsCount / renderPageSize)}
      fetchListInPage={fetchExternalsFromPage}
      loader={loader}
    >
      {(renderList) => <ExternalList renderList={renderList} />}
    </InfiniteScrollList>
  )
}
