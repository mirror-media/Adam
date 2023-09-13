import { useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import errors from '@twreporter/errors'
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import Steps from '../../components/subscribe-steps'
import PlansForNonMember from '../../components/subscribe/plan-non-member'
import PlanForBasicMember from '../../components/subscribe/plan-basic-member'
import PlanForMonthlyMember from '../../components/subscribe/plan-monthly-member'
import PlanForYearlyMember from '../../components/subscribe/plan-yearly-member'
import { ACCESS_SUBSCRIBE_FEATURE_TOGGLE } from '../../config/index.mjs'

const Page = styled.main`
  min-height: 70vh;
  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: -32px;
  }
`

const TestBtnWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: lightsteelblue;

  button {
    background-color: lemonchiffon;
    padding: 2px 8px;
    border: 1px solid lightsalmon;
    color: grey;
    margin-right: 4px;
    margin-top: 4px;
    border-radius: 4px;
  }
`

/**
 * @param {Object} props
 * @param {Object[] } props.sectionsData
 * @param {Object[]} props.topicsData
 * @return {JSX.Element}
 */
function Subscribe({ sectionsData = [], topicsData = [] }) {
  const [memberType, setMemberType] = useState('nonMember') // Default to non-member plan
  const router = useRouter()

  const handleMemberTypeToggle = (type) => {
    setMemberType(type)
  }

  const handleMarketingClick = () => {
    router.push('/marketing') // Redirect to the /marketing page
  }

  return (
    <Layout
      head={{ title: `會員方案選擇` }}
      header={{
        type: 'default',
        data: { sectionsData: sectionsData, topicsData },
      }}
      footer={{ type: 'default' }}
    >
      <Page>
        {/* Conditionally render the Steps component */}
        {memberType !== 'yearlyMember' && <Steps activeStep={1} />}

        {/* Render the appropriate plan based on the membership type */}
        {memberType === 'nonMember' && <PlansForNonMember />}
        {memberType === 'basicMember' && <PlanForBasicMember />}
        {memberType === 'monthlyMember' && <PlanForMonthlyMember />}
        {memberType === 'yearlyMember' && <PlanForYearlyMember />}

        {/* Buttons to toggle plans */}
        <TestBtnWrapper>
          <button onClick={() => handleMemberTypeToggle('nonMember')}>
            Non-Member
          </button>
          <button onClick={() => handleMemberTypeToggle('basicMember')}>
            Basic Member
          </button>
          <button onClick={() => handleMemberTypeToggle('monthlyMember')}>
            Monthly Member
          </button>
          <button onClick={() => handleMemberTypeToggle('yearlyMember')}>
            Yearly Member
          </button>
          <button onClick={handleMarketingClick}>Marketing VIP</button>
        </TestBtnWrapper>
      </Page>
    </Layout>
  )
}

export default Subscribe

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

  if (ACCESS_SUBSCRIBE_FEATURE_TOGGLE !== 'on') {
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
