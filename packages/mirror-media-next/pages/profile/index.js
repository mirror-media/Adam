import { useState } from 'react'
import styled from 'styled-components'

import SaveFailed from '../../components/profile/save-failed'
import SaveSuccess from '../../components/profile/save-success'
import UserDeletionForm from '../../components/profile/user-deletion-form'
import UserProfileForm from '../../components/profile/user-profile-form'
import LayoutFull from '../../components/shared/layout-full'
import useMembershipRequired from '../../hooks/use-membership-required'
import { getLogTraceObject } from '../../utils'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { setPageCache } from '../../utils/cache-setting'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import { processSettledResult } from '../../utils/response-processor'
import redirectToLoginWhileUnauthed from '../../utils/server-side-only/redirect-to-login-while-unauthed'

const FORM = 'form'
const SUCCESS = 'success'
const FAIL = 'fail'

export const MODE = /** @type {const} */ ({
  FORM,
  SUCCESS,
  FAIL,
})

const Page = styled.main`
  padding: 40px 20px;
  margin: 0 auto;
  max-width: min(596px, 100vw);
  overflow-x: hidden;

  ${({ theme }) => theme.breakpoint.md} {
    width: 600px;
    max-width: unset;
    padding: 60px 0;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    width: 680px;
  }
`

const Container = styled.div`
  flex-grow: 1;
  background-color: #fff;
  ${({ theme }) => theme.breakpoint.md} {
    background-color: #f2f2f2;
  }
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 500;
  line-height: 36px;
  margin-bottom: 24px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-bottom: 12px;
  }
`

/**
 * @typedef {Object} PageProps
 * @property {Object} headerData
 * @property {import('../../utils/api').HeadersData} headerData.sectionsData
 * @property {import('../../utils/api').Topics} headerData.topicsData
 * @property {string} signInProvider
 */

/**
 * @param {PageProps} props
 * @returns {import('react').JSX.Element}
 */
export default function Profile({ headerData, signInProvider }) {
  useMembershipRequired()
  /**
   * @type {[string, React.Dispatch<React.SetStateAction<string>>]}
   */
  const [savedStatus, setSavedStatus] = useState(MODE.FORM)

  /**
   * @param {SUCCESS | FAIL} status
   */
  const handleSaved = (status) => {
    setSavedStatus(status)
  }

  const resetStatus = () => {
    setSavedStatus(MODE.FORM)
  }

  return (
    <LayoutFull
      head={{ title: `個人資料` }}
      header={{
        type: 'default',
        data: headerData,
      }}
    >
      {savedStatus === MODE.FORM && (
        <Page>
          <Title>個人資料</Title>
          <UserProfileForm
            onSaved={handleSaved}
            signInProvider={signInProvider}
          />
          <UserDeletionForm />
        </Page>
      )}

      {savedStatus == MODE.SUCCESS && (
        <Container>
          <SaveSuccess onReset={resetStatus} />
        </Container>
      )}
      {savedStatus === MODE.FAIL && (
        <Container>
          <SaveFailed onReset={resetStatus} />
        </Container>
      )}
    </LayoutFull>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export const getServerSideProps = redirectToLoginWhileUnauthed()(async ({
  req,
  res,
  user,
}) => {
  setPageCache(res, { cachePolicy: 'no-store' }, req.url)

  const globalLogFields = getLogTraceObject(req)

  const signInProvider = user.firebase?.sign_in_provider

  const responses = await Promise.allSettled([
    fetchHeaderDataInDefaultPageLayout(),
  ])

  // handle header data
  const [sectionsData, topicsData, flashNewsData] = processSettledResult(
    responses[0],
    getSectionAndTopicFromDefaultHeaderData,
    'Error occurs while getting header data in profile page',
    globalLogFields
  )

  return {
    props: {
      signInProvider: signInProvider,
      headerData: { flashNewsData, sectionsData, topicsData },
    },
  }
})
