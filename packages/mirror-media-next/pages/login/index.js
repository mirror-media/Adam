import { useCallback, useEffect } from 'react'
import styled from 'styled-components'
// import useRedirect from '../../hooks/use-redirect-when-logged-in'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { useMembership } from '../../context/membership'
import { loginState, loginActions } from '../../slice/login-slice'
import {
  errorHandler,
  loginPageOnAuthStateChangeAction,
} from '../../utils/membership'
import ContainerLoginForm from '../../components/login/container-login-form'
import { useRouter } from 'next/router'
import {
  getRedirectResult,
  getAdditionalUserInfo,
  fetchSignInMethodsForEmail,
} from 'firebase/auth'
import { auth } from '../../firebase'
import { FirebaseError } from 'firebase/app'
import { setPageCache } from '../../utils/cache-setting'
import { GCP_PROJECT_ID } from '../../config/index.mjs'
import { LOGIN_PAGE_FEATURE_TOGGLE } from '../../config/index.mjs'

/**
 * @typedef { 'form' | 'registerSuccess' | 'registerError' | 'loginError'} State
 *
 */

/**
 * @template T
 * @typedef {[T, React.Dispatch<React.SetStateAction<T>>]} UseState
 */

const Wrapper = styled.div`
  padding: 20px;
`
export default function Login() {
  const dispatch = useAppDispatch()
  const { accessToken, isLogInProcessFinished, isLoggedIn } = useMembership()
  const router = useRouter()
  const state = useAppSelector(loginState)

  const handleFederatedRedirectResult = useCallback(async () => {
    try {
      const redirectResult = await getRedirectResult(auth)
      if (redirectResult && redirectResult?.user) {
        const firebaseAuthUser = redirectResult.user
        const isNewUser = getAdditionalUserInfo(redirectResult).isNewUser
        const result = await loginPageOnAuthStateChangeAction(
          firebaseAuthUser,
          isNewUser,
          accessToken
        )
        dispatch(loginActions.changeState(result))
      } else if (!redirectResult?.user && isLoggedIn) {
        switch (state) {
          case 'form':
            router.push('/section/member')
            return
          case 'loginSuccess':
          case 'registerSuccess':
            //TODO: redirect to certain page which destination is store at localStorage, not just redirect to index page.
            router.push('/')
            return
          default:
            break
        }
      }
    } catch (e) {
      if (
        e instanceof FirebaseError &&
        e.code === 'auth/account-exists-with-different-credential'
      ) {
        const email =
          e?.customData?.email && typeof e?.customData?.email === 'string'
            ? e?.customData?.email
            : ''
        const responseArray = await fetchSignInMethodsForEmail(auth, email)
        const prevAuthMethod = getPrevAuthMethod(responseArray?.[0])

        dispatch(loginActions.changePrevAuthMethod(prevAuthMethod))
        dispatch(loginActions.changeShouldShowHint(true))
        function getPrevAuthMethod(prevAuthMethod) {
          switch (prevAuthMethod) {
            case 'google.com':
              return 'Google'
            case 'facebook.com':
              return 'Facebook'
            case 'apple.com':
              return 'Apple'
            case 'password':
              return 'email'
            default:
              return prevAuthMethod
          }
        }
      } else {
        errorHandler(e)
        dispatch(loginActions.changeState('loginError'))
      }
    }
  }, [router, isLoggedIn, state, dispatch, accessToken])

  useEffect(() => {
    if (!isLogInProcessFinished) {
      return
    }

    handleFederatedRedirectResult()
  }, [isLogInProcessFinished, dispatch, handleFederatedRedirectResult])
  // useRedirect()

  const getJsx = () => {
    switch (state) {
      case 'form':
        return <ContainerLoginForm></ContainerLoginForm>
      case 'registerSuccess':
        return <>註冊成功</>
      case 'loginSuccess':
        return <>登入成功</>
      case 'registerError':
      case 'loginError':
        return <>登入註冊失敗</>
      default:
        return null
    }
  }

  const jsx = getJsx()

  return (
    <Wrapper>
      state: {state}
      {jsx}
    </Wrapper>
  )
}

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

  if (LOGIN_PAGE_FEATURE_TOGGLE !== 'on') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return { props: {} }
}
