import { useState } from 'react'
import styled from 'styled-components'
import errors from '@twreporter/errors'
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import Steps from '../../components/subscribe-steps'
import Succeeded from '../../components/papermag/succeeded'
import Failed from '../../components/papermag/failed'

import { ACCESS_PAPERMAG_FEATURE_TOGGLE } from '../../config/index.mjs'

const Wrapper = styled.main`
  min-height: 50vh;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 8px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 20;
  }

  ${({ theme }) => theme.breakpoint.lg} {
    padding: 0;
  }
`

/**
 * @param {Object} props
 * @param {Object[] } props.sectionsData
 * @param {Object[]} props.topicsData
 * @return {JSX.Element}
 */
export default function Return({ sectionsData = [], topicsData = [] }) {
  const [isSucceeded, setIsSucceeded] = useState(true) // Initial state: Succeeded

  const toggleResult = () => {
    setIsSucceeded(!isSucceeded)
  }
  return (
    <Layout
      head={{ title: `紙本雜誌訂閱結果` }}
      header={{
        type: 'default',
        data: { sectionsData: sectionsData, topicsData },
      }}
      footer={{ type: 'default' }}
    >
      <>
        <Steps activeStep={3} />
        <hr />
        <Wrapper>
          <button
            style={{ border: '1px solid red', background: 'aqua' }}
            onClick={toggleResult}
          >
            {isSucceeded ? 'Toggle Failed' : 'Toggle Succeeded'}
          </button>
          {isSucceeded ? <Succeeded /> : <Failed />}
        </Wrapper>
      </>
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

  if (ACCESS_PAPERMAG_FEATURE_TOGGLE !== 'on') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  // Fetch header data
  let sectionsData = []
  let topicsData = []

  try {
    const headerData = await fetchHeaderDataInDefaultPageLayout()
    if (Array.isArray(headerData.sectionsData)) {
      sectionsData = headerData.sectionsData
    }
    if (Array.isArray(headerData.topicsData)) {
      topicsData = headerData.topicsData
    }
  } catch (err) {
    const annotatingAxiosError = errors.helpers.annotateAxiosError(err)
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingAxiosError, {
          withStack: true,
          withPayload: true,
        }),
        ...globalLogFields,
      })
    )
  }

  return {
    props: {
      sectionsData,
      topicsData,
    },
  }
}
