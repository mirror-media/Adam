import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import client from '../../../apollo/apollo-client'
import { fetchWeeklys } from '../../../apollo/query/magazines'
import Layout from '../../../components/shared/layout'
import { getLogTraceObject } from '../../../utils'
import { fetchShellHeaderData } from '../../../utils/api'
import { setPageCache } from '../../../utils/cache-setting'
import { processSettledResult } from '../../../utils/response-processor'
import redirectToLoginWhileUnauthed from '../../../utils/server-side-only/redirect-to-login-while-unauthed'

const Page = styled.div`
  padding: 0;

  iframe {
    display: block;
    width: 100%;
    height: 100dvh;
    border: 0;
  }
`

export default function BookBIssuePublish({ headerData, weeklys }) {
  const router = useRouter()
  const { book, issue } = router.query
  const issueString = Array.isArray(issue) ? issue.join('') : issue
  const iframeSrc = `https://storage.googleapis.com/mm-magazine/${book}/${issueString}/index.html`

  // Check if iframeSrc is valid, if not, redirect to /404 page

  useEffect(() => {
    const validSrcs = weeklys.map((weekly) => {
      const issueNumber = weekly.slug.match(/\d+/)[0]
      const bookLetter = weekly.slug.endsWith('A本') ? 'A' : 'B'
      return `https://storage.googleapis.com/mm-magazine/Book_${bookLetter}/${bookLetter}${issueNumber}-Publish/index.html`
    })

    if (!validSrcs.includes(iframeSrc)) {
      router.push('/404')
    }
  }, [weeklys, iframeSrc, router])

  return (
    <Layout
      head={{ title: `動態雜誌 ${issueString.split('-')[0]}` }}
      header={{ type: 'default', data: headerData }}
      withFooter={false}
    >
      <Page>
        <iframe
          src={iframeSrc}
          title={`動態雜誌 ${issueString.split('-')[0]}`}
        />
      </Page>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export const getServerSideProps = redirectToLoginWhileUnauthed()(async ({
  params,
  req,
  res,
}) => {
  setPageCache(res, { cachePolicy: 'no-store' }, req.url)

  const globalLogFields = getLogTraceObject(req)
  const { issue } = params

  const responses = await Promise.allSettled([
    fetchShellHeaderData({ logFields: globalLogFields }),
    client.query({
      query: fetchWeeklys,
    }),
  ])

  const headerData = processSettledResult(
    responses[0],
    (data) =>
      data ?? {
        flashNewsData: [],
        navigationData: [],
        sectionPostsData: {},
        topicsData: [],
      },
    `Error occurs while getting shell header data in magazine page (issue: ${issue})`,
    globalLogFields
  )

  const weeklys = processSettledResult(
    responses[1],
    (
      /** @type {import('@apollo/client').ApolloQueryResult<any> | undefined} */ gqlData
    ) => {
      return gqlData?.data?.magazines || []
    },
    `Error occurs while getting data in magazine page (issue: ${issue})`,
    globalLogFields
  )

  return {
    props: {
      headerData,
      weeklys,
    },
  }
})
