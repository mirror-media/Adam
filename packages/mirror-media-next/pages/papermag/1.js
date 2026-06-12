import styled from 'styled-components'

import SubscribePaperMagForm from '../../components/papermag/subscribe-papermag-form'
import Layout from '../../components/shared/layout'
import Steps from '../../components/subscribe-steps'
import { PLAN } from '../../constants/papermag'
import { getLogTraceObject } from '../../utils'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import { processSettledResult } from '../../utils/response-processor'

const Page = styled.main`
  min-height: 65vh;
`
const Hr = styled.hr`
  margin-bottom: 8px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 48px;
  }
`

/**
 * @typedef PageProps
 * @property {import('../../utils/api').HeadersData} sectionsData
 * @property {import('../../utils/api').Topics} topicsData
 */

/**
 * @param {PageProps} props
 * @returns {React.ReactNode}
 */
function OneYearSubscription({ sectionsData = [], topicsData = [] }) {
  return (
    <Layout
      head={{ title: `訂閱一年方案` }}
      header={{
        type: 'default',
        data: { sectionsData: sectionsData, topicsData },
      }}
      footer={{ type: 'default' }}
    >
      <Page>
        <Steps activeStep={2} />
        <Hr />
        <SubscribePaperMagForm plan={PLAN.ONE_YEAR} />
      </Page>
    </Layout>
  )
}

export default OneYearSubscription

/**
 * @type {import('next').GetServerSideProps<PageProps>}
 */
export async function getServerSideProps({ req, res }) {
  setPageCache(res, { cachePolicy: 'no-store' }, req.url)

  const globalLogFields = getLogTraceObject(req)

  // Fetch header data
  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
  ])

  const [sectionsData, topicsData] = processSettledResult(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in papermag/1 page',
    globalLogFields
  )

  return {
    props: {
      sectionsData,
      topicsData,
    },
  }
}
