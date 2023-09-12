import styled from 'styled-components'
import errors from '@twreporter/errors'
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import Layout from '../../components/shared/layout'
import BlankCard from '../../components/subscribe/blank-card'
import PrimaryBlueBtn from '../../components/subscribe/primary-blue-btn'

const PageWrapper = styled.section`
  min-height: 70vh;
  padding: 40px 20px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 48px;
    background-color: rgba(0, 0, 0, 0.05);
  }

  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: -32px;
  }
`
const Title = styled.h2`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 12px;
`
const Text = styled.div`
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-weight: 400;
  span {
    color: #054f77;
  }
`

/**
 * @param {Object} props
 * @param {Object[] } props.sectionsData
 * @param {Object[]} props.topicsData
 * @return {JSX.Element}
 */
function Subscribe({ sectionsData = [], topicsData = [] }) {
  return (
    <Layout
      head={{ title: `VIP或團體訂購` }}
      header={{
        type: 'default',
        data: { sectionsData: sectionsData, topicsData },
      }}
      footer={{ type: 'default' }}
    >
      <PageWrapper>
        <BlankCard>
          <Title>此頁面為個人會員訂閱頁面</Title>
          <Text>
            由於您為鏡週刊的 VIP 或團體訂購，VIP
            及團體訂購期間不須付款即享會員專區文章暢讀。
            若您有意願付費支持，請於期間後再付款。
          </Text>
          <PrimaryBlueBtn title="回會員專區" href="/premiumsection/member" />
        </BlankCard>
      </PageWrapper>
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
