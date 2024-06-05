import styled from 'styled-components'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { useMembership } from '../../context/membership'
import {
  loginState,
  loginActions,
  FormState,
  AuthMethod,
} from '../../slice/login-slice'
import {
  errorHandler,
  loginPageOnAuthStateChangeAction,
} from '../../utils/membership'
import MainForm from '../../components/login/main-form'
import RegistrationSuccess from '../../components/login/registration-success'
import RegistrationFailed from '../../components/login/registration-failed'
import LoginFailed from '../../components/login/login-failed'
import useRedirect from '../../hooks/use-redirect'
import {
  getRedirectResult,
  getAdditionalUserInfo,
  fetchSignInMethodsForEmail,
} from 'firebase/auth'
import { auth } from '../../firebase'
import { FirebaseError } from 'firebase/app'
import { setPageCache } from '../../utils/cache-setting'
import LayoutFull from '../../components/shared/layout-full'
import { FirebaseAuthError } from '../../constants/firebase'
import { fetchHeaderDataInDefaultPageLayout } from '../../utils/api'
import { getSectionAndTopicFromDefaultHeaderData } from '../../utils/data-process'
import { getLogTraceObject } from '../../utils'
import { handleAxiosResponse } from '../../utils/response-handle'
import redirectToDestinationWhileAuthed from '../../utils/server-side-only/redirect-to-destination-while-authed'

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
 * @property {import('../../utils/api').HeadersData} headerData.sectionsData
 * @property {import('../../utils/api').Topics} headerData.topicsData
 */

/**
 * @param {PageProps} props
 */
export default function Login({ headerData }) {
  const dispatch = useAppDispatch()
  const { accessToken, isLogInProcessFinished, userEmail } = useMembership()
  const loginFormState = useAppSelector(loginState)
  const { redirect } = useRedirect()

  useEffect(() => {
    if (!isLogInProcessFinished) {
      return
    }

    const handleFederatedRedirectResult = async () => {
      function getPrevAuthMethod(prevAuthMethod) {
        switch (prevAuthMethod) {
          case 'google.com':
            return AuthMethod.Google
          case 'facebook.com':
            return AuthMethod.Facebook
          case 'apple.com':
            return AuthMethod.Apple
          case 'password':
            return AuthMethod.Email
          default:
            return prevAuthMethod
        }
      }

      try {
        const redirectResult = await getRedirectResult(auth)
        if (redirectResult && redirectResult?.user) {
          const firebaseAuthUser = redirectResult.user
          const isNewUser = getAdditionalUserInfo(redirectResult).isNewUser
          await loginPageOnAuthStateChangeAction(
            firebaseAuthUser,
            isNewUser,
            accessToken
          )
          redirect()
        }
      } catch (e) {
        if (
          e instanceof FirebaseError &&
          e.code === FirebaseAuthError.ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL
        ) {
          const email =
            e?.customData?.email && typeof e?.customData?.email === 'string'
              ? e?.customData?.email
              : ''
          const responseArray = await fetchSignInMethodsForEmail(auth, email)
          const prevAuthMethod = getPrevAuthMethod(responseArray?.[0])

          dispatch(loginActions.changePrevAuthMethod(prevAuthMethod))
          dispatch(
            loginActions.changeShouldShowHintOfExitenceOfDifferentAuthMethod(
              true
            )
          )
        } else {
          errorHandler(e, { userEmail })
          dispatch(loginActions.changeState(FormState.LoginFail))
        }
      } finally {
        dispatch(loginActions.changeIsFederatedRedirectResultLoading(false))
      }
    }

    handleFederatedRedirectResult()
  }, [isLogInProcessFinished, accessToken, redirect, dispatch, userEmail])

  const getBodyByState = () => {
    switch (loginFormState) {
      case FormState.Form:
        return <MainForm />
      case FormState.RegisterSuccess:
        return <RegistrationSuccess />
      case FormState.LoginSuccess:
        return <>登入成功</>
      case FormState.RegisterFail:
        return <RegistrationFailed />
      case FormState.LoginFail:
        return <LoginFailed />
      default:
        return null
    }
  }

  const jsx = getBodyByState()

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
export const getServerSideProps = redirectToDestinationWhileAuthed()(
  async ({ req, res }) => {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)

    const globalLogFields = getLogTraceObject(req)

    const responses = await Promise.allSettled([
      fetchHeaderDataInDefaultPageLayout(),
    ])

    // handle header data
    const [sectionsData, topicsData] = handleAxiosResponse(
      responses[0],
      getSectionAndTopicFromDefaultHeaderData,
      'Error occurs while getting header data in login page',
      globalLogFields
    )

    return {
      props: {
        headerData: { sectionsData, topicsData },
      },
    }
  }
)
