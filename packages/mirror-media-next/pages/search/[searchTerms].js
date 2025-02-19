import styled from 'styled-components'
import Image from 'next/legacy/image'
import SearchedArticles from '../../components/search/searched-articles'
import { ENV } from '../../config/index.mjs'
import { setPageCache } from '../../utils/cache-setting'
import { getLogTraceObject } from '../../utils'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { handleAxiosResponse } from '../../utils/response-handle'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import Layout from '../../components/shared/layout'
import { getSearchResult } from '../../utils/api/search'

const SearchContainer = styled.main`
  width: 320px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoint.md} {
    width: 672px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 1024px;
    padding: 0;
  }
`

const SearchTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoint.md} {
    &::after {
      content: '';
      margin: 0px 0px 0px 28px;
      display: inline-block;
      flex: 1 1 auto;
      height: 2px;
      background: linear-gradient(90deg, rgb(0, 0, 0) 30%, rgb(255, 255, 255));
    }
  }
`

const SearchTitle = styled.h1`
  display: inline-block;
  margin: 16px 0 16px;
  padding: 4px 16px;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 600;
  border-radius: 6px;
  display: flex;
  align-items: start;
  ${({ theme }) => theme.breakpoint.md} {
    margin: 20px 0 24px;
    padding: 4px 8px;
    font-size: 28px;
    font-weight: 500;
    line-height: 1.4;
    border-radius: 10px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 24px 0 28px;
  }
`

const CommaStart = styled.span`
  display: inline-flex;
  margin-right: 6px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-right: 8px;
  }
`
const CommaEnd = styled.span`
  display: inline-flex;
  margin-left: 6px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-left: 16px;
  }
`

/**
 * @typedef {Object} SearchResult
 * @property {string} searchTerms
 * @property {import('../../utils/api/search').Document[]} items
 */

/**
 * @typedef {Object} SearchProps
 * @property {import('../../components/header/share-header').HeaderData} headerData
 * @property {SearchResult} searchResult
 */

/**
 * @param {SearchProps} props
 * @returns {React.ReactElement}
 */

export default function Search({ searchResult, headerData }) {
  const searchTerms = searchResult?.searchTerms ?? ''

  return (
    <Layout
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <SearchContainer>
        <SearchTitleWrapper>
          <SearchTitle>
            <CommaStart>
              <Image
                src="/images-next/double-comma-start.svg"
                alt="double comma start"
                width={8}
                height={6.6}
              ></Image>
            </CommaStart>
            {searchTerms}
            <CommaEnd>
              <Image
                src="/images-next/double-comma-end.svg"
                alt="double comma end"
                width={8}
                height={6.6}
              ></Image>
            </CommaEnd>
          </SearchTitle>
        </SearchTitleWrapper>
        {searchResult?.items && (
          <SearchedArticles searchResult={searchResult} />
        )}
      </SearchContainer>
    </Layout>
  )
}

export async function getServerSideProps({ req, res, params }) {
  const searchTerms = params.searchTerms ?? ''
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 600 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  let globalLogFields = getLogTraceObject(req)

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
    getSearchResult({ query: searchTerms, take: 100 }),
  ])

  // handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in search page',
    globalLogFields
  )

  const searchData = handleAxiosResponse(
    responses[1],
    (/** @type {Awaited<ReturnType<typeof getSearchResult>>} */ data) =>
      data?.data || [],
    'Error occurs while getting search data in search page',
    globalLogFields
  )

  const props = {
    searchResult: { searchTerms, items: searchData },
    headerData: { sectionsData, topicsData },
  }

  return { props }
}
