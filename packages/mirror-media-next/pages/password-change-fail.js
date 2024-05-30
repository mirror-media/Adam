import styled from 'styled-components'
import LayoutFull from '../components/shared/layout-full'
import GenericFailed from '../components/login/generic-failed'
import { useRouter } from 'next/router'
import { setPageCache } from '../utils/cache-setting'
import { ENV } from '../config/index.mjs'
import { getLogTraceObject } from '../utils'
import { handleAxiosResponse } from '../utils/response-handle'
import { fetchHeaderDataInDefaultPageLayout } from '../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../utils/data-process'

const Container = styled.div`
  flex-grow: 1;

  background-color: #fff;
  ${({ theme }) => theme.breakpoint.md} {
    background-color: #f2f2f2;
  }
`

/**
 * @typedef {Object} PageProps
 * @property {Object} headerData
 * @property {import('../utils/api').HeadersData} headerData.sectionsData
 * @property {import('../utils/api').Topics} headerData.topicsData
 */

/**
 * @param {PageProps} props
 */
export default function PasswordChangeFail({ headerData }) {
  const router = useRouter()

  /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
  const onBack = () => {
    router.replace({
      pathname: '/recover-password',
    })
  }

  return (
    <LayoutFull
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <Container>
        <GenericFailed primaryText="請回上一頁重試" onBack={onBack} />
      </Container>
    </LayoutFull>
  )
}

/**
 * @type {import('next').GetServerSideProps<PageProps>}
 */
export async function getServerSideProps({ req, res }) {
  if (ENV === 'prod') {
    setPageCache(res, { cachePolicy: 'max-age', cacheTime: 900 }, req.url)
  } else {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
  }

  const globalLogFields = getLogTraceObject(req)

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
  ])

  // handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in password change failed page',
    globalLogFields
  )

  return {
    props: {
      headerData: { sectionsData, topicsData },
    },
  }
}
