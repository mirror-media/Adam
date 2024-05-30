/**
 * Custom Firebase Email handler
 * @see https://firebase.google.com/docs/auth/custom-email-handler
 */

import styled from 'styled-components'
import { setPageCache } from '../utils/cache-setting'
import LayoutFull from '../components/shared/layout-full'
import BodyPasswordReset from '../components/email-handler/body-password-reset'
import BodyEmailVerification from '../components/email-handler/body-email-verification'
import { fetchHeaderDataInDefaultPageLayout } from '../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../utils/data-process'
import { getLogTraceObject, getSearchParamFromApiKeyUrl } from '../utils'
import { handleAxiosResponse } from '../utils/response-handle'

const RESET_PASSWORD = 'resetPassword'
const RECOVER_EMAIL = 'recoverEmail'
const VERIFY_EMAIL = 'verifyEmail'
const MODE = /** @type {const} */ ({
  RESET_PASSWORD,
  RECOVER_EMAIL,
  VERIFY_EMAIL,
})

const Container = styled.div`
  flex-grow: 1;

  background-color: #fff;
  ${({ theme }) => theme.breakpoint.md} {
    background-color: #f2f2f2;
  }
`

/**
 * @typedef {Object} PageProps
 * @property {RESET_PASSWORD | VERIFY_EMAIL}  mode
 * @property {Object} headerData
 * @property {import('../utils/api').HeadersData} headerData.sectionsData
 * @property {import('../utils/api').Topics} headerData.topicsData
 */

/**
 * @param {PageProps} props
 */
export default function EmailHandler({ mode, headerData }) {
  const getBodyByMode = () => {
    switch (mode) {
      case MODE.RESET_PASSWORD:
        return <BodyPasswordReset />
      case MODE.VERIFY_EMAIL:
        return <BodyEmailVerification />
    }
  }

  const jsx = getBodyByMode()

  return (
    <LayoutFull
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <Container>{jsx}</Container>
    </LayoutFull>
  )
}

/**
 * @type {import('next').GetServerSideProps<PageProps>}
 */
export const getServerSideProps = async ({ req, res, query }) => {
  setPageCache(res, { cachePolicy: 'no-store' }, req.url)

  const globalLogFields = getLogTraceObject(req)

  const mode = getSearchParamFromApiKeyUrl(query, 'mode')

  if (Array.isArray(mode)) {
    return {
      notFound: true,
    }
  }

  if ([RESET_PASSWORD, VERIFY_EMAIL].includes(mode) === false) {
    return {
      notFound: true,
    }
  }

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
  ])

  // handle header data
  const [sectionsData, topicsData] = handleAxiosResponse(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in email-handler',
    globalLogFields
  )

  return {
    props: {
      mode: /** @type {RESET_PASSWORD | VERIFY_EMAIL} */ (mode),
      headerData: { sectionsData, topicsData },
    },
  }
}
