import styled from 'styled-components'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import { getLogTraceObject } from '../../utils'
import { handleAxiosResponse } from '../../utils/response-handle'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import Steps from '../../components/subscribe-steps'
import Plan from '../../components/papermag/plan-selections'
import Notice from '../../components/papermag/notice'
import { ACCESS_PAPERMAG_FEATURE_TOGGLE } from '../../config/index.mjs'

const Page = styled.main`
  min-height: 65vh;
`
/**
 * @param {Object} props
 * @param {Object[] } props.sectionsData
 * @param {Object[]} props.topicsData
 * @return {JSX.Element}
 */
function PaperMag({ sectionsData = [], topicsData = [] }) {
  return (
    <Layout
      head={{ title: `訂閱紙本雜誌` }}
      header={{
        type: 'default',
        data: { sectionsData: sectionsData, topicsData },
      }}
      footer={{ type: 'default' }}
    >
      <Page>
        <Steps activeStep={1} />
        <Plan />
        <Notice />
      </Page>
    </Layout>
  )
}

export default PaperMag

/**
 * @type {import('next').GetServerSideProps}
 */
export async function getServerSideProps({ req, res }) {
  setPageCache(res, { cachePolicy: 'no-store' }, req.url)

  if (ACCESS_PAPERMAG_FEATURE_TOGGLE !== 'on') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const globalLogFields = getLogTraceObject(req)

  // Fetch header data
  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
  ])

  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in papermag page',
    globalLogFields
  )

  return {
    props: {
      sectionsData,
      topicsData,
    },
  }
}
