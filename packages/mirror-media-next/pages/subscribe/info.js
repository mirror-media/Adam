import styled from 'styled-components'
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import { setPageCache } from '../../utils/cache-setting'
import { ACCESS_SUBSCRIBE_FEATURE_TOGGLE } from '../../config/index.mjs'

const Page = styled.main`
  min-height: 70vh;
  ${({ theme }) => theme.breakpoint.xl} {
    margin-bottom: -32px;
  }
`

/**

 * @return {JSX.Element}
 */
function SubscribeInfo() {
  return <Page>subscribe info page</Page>
}

export default SubscribeInfo

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
  } else {
    return {
      notFound: true,
    }
  }
}
