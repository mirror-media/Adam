import styled from 'styled-components'

import InfiniteScrollList from '../infinite-scroll-list'
import Image from 'next/legacy/image'
import LoadingPage from '../../public/images-next/loading_page.gif'
import ExternalList from './externals-list'

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
 * @typedef {import('../../utils/api/externals').FetchExternalsByPartnerSlug} FetchExternalsByPartnerSlug
 */
/**
 * @typedef {import('../../utils/api/externals').FetchExternalsWhichPartnerIsNotShowOnIndex} FetchExternalsWhichPartnerIsNotShowOnIndex
 */

/**
 *
 * @param {Object} props
 * @param {number} props.externalsCount
 * @param {ListingExternal[]} props.externals
 * @param {FetchExternalsByPartnerSlug | FetchExternalsWhichPartnerIsNotShowOnIndex} props.fetchExternalsFunction
 * @param {string} [props.partnerSlug]
 * @param {number} props.renderPageSize
 * @returns {React.ReactElement}
 */
export default function ExternalArticles({
  externalsCount,
  externals,
  fetchExternalsFunction,
  renderPageSize,
  partnerSlug,
}) {
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
      fetchListInPage={(page) =>
        fetchExternalsFunction(page, renderPageSize, partnerSlug)
      }
      loader={loader}
    >
      {(renderList) => <ExternalList renderList={renderList} />}
    </InfiniteScrollList>
  )
}
