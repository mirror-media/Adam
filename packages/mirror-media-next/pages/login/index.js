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
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import LayoutFull from '../../components/shared/layout-full'
import { FirebaseAuthError } from '../../constants/firebase'
import redirectToDestinationWhileAuthed from '../../utils/redirect-to-destination-while-authed'

const Container = styled.div`
  flex-grow: 1;

  background-color: #fff;
  ${({ theme }) => theme.breakpoint.md} {
    background-color: #f2f2f2;
  }
`

export default function Login() {
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
    <LayoutFull header={{ type: 'default' }} footer={{ type: 'default' }}>
      <Container>{jsx}</Container>
    </LayoutFull>
  )
}

/**
 * @type {import('next').GetServerSideProps}
 */
export const getServerSideProps = redirectToDestinationWhileAuthed()(
  async ({ req, res }) => {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
    const traceHeader = req.headers?.['x-cloud-trace-context']
    let globalLogFields = {}
    if (traceHeader && !Array.isArray(traceHeader)) {
      const [trace] = traceHeader.split('/')
      globalLogFields[
        'logging.googleapis.com/trace'
      ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
    }

    return {
      props: {},
    }
  }
)
