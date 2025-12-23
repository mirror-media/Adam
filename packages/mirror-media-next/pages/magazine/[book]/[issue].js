import { useRouter } from 'next/router'
import { useEffect } from 'react'
import styled from 'styled-components'

import client from '../../../apollo/apollo-client'
import { setPageCache } from '../../../utils/cache-setting'
import { fetchWeeklys } from '../../../apollo/query/magazines'
import Layout from '../../../components/shared/layout'
import { getLogTraceObject } from '../../../utils'
import { processSettledResult } from '../../../utils/response-processor'
import redirectToLoginWhileUnauthed from '../../../utils/server-side-only/redirect-to-login-while-unauthed'
import { IS_ANNIVERSARY_PROMO_ACTIVE } from '../../../config/index.mjs'

const Page = styled.div`
  padding: 0;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
  }
`

export default function BookBIssuePublish({ weeklys }) {
  console.log('weeklys:', weeklys)
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
      header={{ type: 'empty' }}
      footer={{ type: 'empty' }}
    >
      <Page>
        <iframe src={iframeSrc} />
      </Page>
    </Layout>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export const getServerSideProps = redirectToLoginWhileUnauthed({
  // TODO:  周年慶完結後待移除 prop
  skipRedirect: IS_ANNIVERSARY_PROMO_ACTIVE,
})(async ({ params, req, res }) => {
  setPageCache(res, { cachePolicy: 'no-store' }, req.url)

  const globalLogFields = getLogTraceObject(req)
  const { issue } = params

  const responses = await Promise.allSettled([
    client.query({
      query: fetchWeeklys,
    }),
  ])

  const weeklys = processSettledResult(
    responses[0],
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
      weeklys,
    },
  }
})
