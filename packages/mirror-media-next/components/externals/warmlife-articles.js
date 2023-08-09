import styled from 'styled-components'

import InfiniteScrollList from '../infinite-scroll-list'
import Image from 'next/legacy/image'
import LoadingPage from '../../public/images/loading_page.gif'
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
 */
/**
 *
 * @param {Object} props
 * @param {ListingExternal[]} props.warmLifeExternals
 * @param {number} props.renderPageSize
 * @returns {React.ReactElement}
 */
export default function WarmLifeArticles({
  warmLifeExternals,
  renderPageSize,
}) {
  const loader = (
    <Loading key={0}>
      <Image src={LoadingPage} alt="loading page"></Image>
    </Loading>
  )

  function fetchMoreWarmLifeJSON() {
    // Special requirement:
    // The "warmlife" data currently only needs to fetch the JSON once, so the function is set to an empty function.
    // If there are new JSON data need to fetch in the future, can be added here.
  }

  // number of json files has warm-life data, and we need to fetch
  const JSON_FILE_COUNT = 1

  return (
    <InfiniteScrollList
      initialList={warmLifeExternals}
      renderAmount={renderPageSize}
      fetchListInPage={fetchMoreWarmLifeJSON}
      loader={loader}
      fetchCount={JSON_FILE_COUNT}
    >
      {(renderList) => <ExternalList renderList={renderList} />}
    </InfiniteScrollList>
  )
}
