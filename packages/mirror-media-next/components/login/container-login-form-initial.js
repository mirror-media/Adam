import { fetchSignInMethodsForEmail } from 'firebase/auth'
import ContainerMembershipLoginWithThirdParty from './container-membership-login-with-third-party'
import UiMembershipInputEmailInvalidation from './ui-membership-input-email-invalidation'
import UiMembershipButton from './ui/button/ui-membership-button'
import { auth } from '../../firebase'
import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux'
import {
  loginEmail,
  loginPrevAuthMethod,
  loginShouldShowHint,
  loginActions,
} from '../../slice/login-slice'
/**
 * @typedef {import('./container-membership-login-with-third-party').ThirdPartyName} ThirdPartyName
 */

/**
 * @type { {name: ThirdPartyName}[]}
 */
const THIRD_PARTY_LIST = [
  { name: 'Google' },
  { name: 'Facebook' },
  { name: 'Apple' },
]
export default function ContainerLoginFormInitial() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const email = useAppSelector(loginEmail)
  const prevAuthMethod = useAppSelector(loginPrevAuthMethod)
  const shouldShowHint = useAppSelector(loginShouldShowHint)
  const hint = `由於您曾以 ${prevAuthMethod} 帳號登入，請點擊上方「使用${prevAuthMethod}帳號繼續」重試。`
  const handleOnClick = async () => {
    setIsLoading(true)
    try {
      const responseArray = await fetchSignInMethodsForEmail(auth, email)

      /*
       * Hint, If email verify is active in the future,
       * responseArray would have multi value
       */
      const isEmailExistWithEmailLinkSignInMethod =
        responseArray &&
        responseArray.find((signInMethod) => signInMethod === 'emailLink')

      const isEmailExistWithEmailPasswordSignInMethod =
        responseArray &&
        responseArray.find((signInMethod) => signInMethod === 'password')

      const isEmailHasBeenUsedByGoogleAuth =
        responseArray &&
        responseArray.find((signInMethod) => signInMethod === 'google.com')

      const isEmailHasBeenUsedByFacebookAuth =
        responseArray &&
        responseArray.find((signInMethod) => signInMethod === 'facebook.com')

      const isEmailHasBeenUsedByAppleAuth =
        responseArray &&
        responseArray.find((signInMethod) => signInMethod === 'apple.com')
      if (isEmailExistWithEmailLinkSignInMethod) {
        dispatch(loginActions.changeLoginFormMode('recoverPassword'))
      } else if (isEmailExistWithEmailPasswordSignInMethod) {
        dispatch(loginActions.changeLoginFormMode('login'))
        dispatch(loginActions.changePrevAuthMethod('email'))
        dispatch(loginActions.changeShouldShowHint(true))
      } else if (isEmailHasBeenUsedByGoogleAuth) {
        dispatch(loginActions.changePrevAuthMethod('Google'))
        dispatch(loginActions.changeShouldShowHint(true))
      } else if (isEmailHasBeenUsedByFacebookAuth) {
        dispatch(loginActions.changePrevAuthMethod('Facebook'))
        dispatch(loginActions.changeShouldShowHint(true))
      } else if (isEmailHasBeenUsedByAppleAuth) {
        dispatch(loginActions.changePrevAuthMethod('Apple'))
        dispatch(loginActions.changeShouldShowHint(true))
      } else {
        dispatch(loginActions.changeLoginFormMode('register'))
      }

      setIsLoading(false)
    } catch (e) {
      console.log(e)
      setIsLoading(false)
    }
  }
  return (
    <div>
      ContainerLoginFormInitial
      <p>第三方登入</p>
      {THIRD_PARTY_LIST.map((item) => (
        <ContainerMembershipLoginWithThirdParty
          key={item.name}
          thirdPartyName={item.name}
        />
      ))}
      {shouldShowHint && <p>{hint}</p>}
      <p>或</p>
      <UiMembershipInputEmailInvalidation></UiMembershipInputEmailInvalidation>
      <UiMembershipButton buttonType={'primary'} handleOnClick={handleOnClick}>
        {isLoading ? '載入中...' : '下一步'}
      </UiMembershipButton>
    </div>
  )
}
