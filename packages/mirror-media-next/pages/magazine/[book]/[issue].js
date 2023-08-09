import errors from '@twreporter/errors'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import styled from 'styled-components'

import client from '../../../apollo/apollo-client'
import { GCP_PROJECT_ID } from '../../../config/index.mjs'
import { setPageCache } from '../../../utils/cache-setting'
import { fetchWeeklys } from '../../../apollo/query/magazines'
import Layout from '../../../components/shared/layout'

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
export async function getServerSideProps({ req, res }) {
  setPageCache(res, { cachePolicy: 'no-store' }, req.url)

  const traceHeader = req.headers?.['x-cloud-trace-context']
  let globalLogFields = {}
  if (traceHeader && !Array.isArray(traceHeader)) {
    const [trace] = traceHeader.split('/')
    globalLogFields[
      'logging.googleapis.com/trace'
    ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
  }

  const responses = await Promise.allSettled([
    client.query({
      query: fetchWeeklys,
    }),
  ])

  const handledResponses = responses.map((response) => {
    if (response.status === 'fulfilled') {
      return response.value.data
    } else if (response.status === 'rejected') {
      const { graphQLErrors, clientErrors, networkError } = response.reason
      const annotatingError = errors.helpers.wrap(
        response.reason,
        'UnhandledError',
        'Error occurs while getting magazine issue page data'
      )

      console.log(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(
            annotatingError,
            {
              withStack: true,
              withPayload: true,
            },
            0,
            0
          ),
          debugPayload: {
            graphQLErrors,
            clientErrors,
            networkError,
          },
          ...globalLogFields,
        })
      )
      return
    }
  })

  const weeklys = handledResponses[0]?.magazines || []

  return {
    props: {
      weeklys,
    },
  }
}
