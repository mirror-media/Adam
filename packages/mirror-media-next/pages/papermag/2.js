import styled from 'styled-components'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import { getLogTraceObject } from '../../utils'
import { handleAxiosResponse } from '../../utils/response-handle'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import Steps from '../../components/subscribe-steps'
import SubscribePaperMagForm from '../../components/papermag/subscribe-papermag-form'

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
function TwoYearsSubscription({ sectionsData = [], topicsData = [] }) {
  return (
    <Layout
      head={{ title: `訂閱二年方案` }}
      header={{
        type: 'default',
        data: { sectionsData: sectionsData, topicsData },
      }}
      footer={{ type: 'default' }}
    >
      <Page>
        <Steps activeStep={2} />
        <Hr />
        <SubscribePaperMagForm plan={2} />
      </Page>
    </Layout>
  )
}

export default TwoYearsSubscription

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

  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in papermag/2 page',
    globalLogFields
  )

  return {
    props: {
      sectionsData,
      topicsData,
    },
  }
}
