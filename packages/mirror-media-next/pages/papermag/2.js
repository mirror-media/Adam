import styled from 'styled-components'
import errors from '@twreporter/errors'
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import Steps from '../../components/subscribe-steps'
import SubscribePaperMagForm from '../../components/papermag/subscribe-papermag-form'
import { ACCESS_PAPERMAG_FEATURE_TOGGLE } from '../../config/index.mjs'

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
 * @param {Object} props
 * @param {Object[] } props.sectionsData
 * @param {Object[]} props.topicsData
 * @return {JSX.Element}
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
