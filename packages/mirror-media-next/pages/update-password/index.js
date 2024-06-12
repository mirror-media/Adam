import styled from 'styled-components'
import { setPageCache } from '../../utils/cache-setting'
import { getLogTraceObject } from '../../utils'
import { handleAxiosResponse } from '../../utils/response-handle'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import useMembershipRequired from '../../hooks/use-membership-required'
import LayoutFull from '../../components/shared/layout-full'
import FormWrapper from '../../components/login/form-wrapper'
import MainForm from '../../components/update-password/main-form'
import redirectToLoginWhileUnauthed from '../../utils/server-side-only/redirect-to-login-while-unauthed'

const Container = styled.div`
  flex-grow: 1;

  background-color: #fff;
  ${({ theme }) => theme.breakpoint.md} {
    background-color: #f2f2f2;
  }
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PrimaryText = styled.p`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
`

/**
 * @typedef {Object} PageProps
 * @property {Object} headerData
 * @property {import('../../utils/api').HeadersData} headerData.sectionsData
 * @property {import('../../utils/api').Topics} headerData.topicsData
 */

/**
 * @param {PageProps} props
 */
export default function UpdatePassword({ headerData }) {
  useMembershipRequired()

  return (
    <LayoutFull
      header={{ type: 'default', data: headerData }}
      footer={{ type: 'default' }}
    >
      <Container>
        <Main>
          <FormWrapper>
            <PrimaryText>變更密碼</PrimaryText>
            <MainForm />
          </FormWrapper>
        </Main>
      </Container>
    </LayoutFull>
  )
}

/**
 * @type {import('next').GetServerSideProps<PageProps>}
 */
export const getServerSideProps = redirectToLoginWhileUnauthed()(
  async ({ req, res, user }) => {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)

    const globalLogFields = getLogTraceObject(req)

    const signInProvider = user.firebase?.sign_in_provider
    if (signInProvider !== 'password') {
      return {
        redirect: {
          statusCode: 307,
          destination: '/profile',
        },
      }
    }

    const responses = await Promise.allSettled([
      fetchHeaderDataInDefaultPageLayout(),
    ])

    // handle header data
    const [sectionsData, topicsData] = handleAxiosResponse(
      responses[0],
      getSectionAndTopicFromDefaultHeaderData,
      'Error occurs while getting header data in update password page',
      globalLogFields
    )

    return {
      props: {
        headerData: { sectionsData, topicsData },
      },
    }
  }
)
