import styled from 'styled-components'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import { auth } from '../../firebase'
import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux'
import {
  loginEmail,
  loginPrevAuthMethod,
  loginShouldShowHintOfExitenceOfDifferentAuthMethod,
  loginActions,
  loginIsFederatedRedirectResultLoading,
  AuthMethod,
} from '../../slice/login-slice'
import { isValidEmail, isCompanyEmail } from '../../utils'
import EmailInput from './email-input'
import PrimaryButton from '../shared/buttons/primary-button'
import ButtonLoginWithThirdParty from './button-login-with-third-party'
import ReminderSection from './reminder-section'
import CenteredHint from '../shared/centered-hint'
import { InputState } from '../../constants/form'

/**
 * @typedef {import('./button-login-with-third-party').ThirdPartyName} ThirdPartyName
 */

/**
 * @type { {name: ThirdPartyName}[]}
 */
const THIRD_PARTY_LIST = [
  { name: AuthMethod.Facebook },
  { name: AuthMethod.Google },
  { name: AuthMethod.Apple },
]

const ThirdPartyButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`

const Seperator = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.3);
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;

  > span {
    margin-left: 12px;
    margin-right: 12px;
  }

  &:before,
  &:after {
    content: '';
    display: flex;
    flex-grow: 1;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
`

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
`

export default function MainFormStart() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const email = useAppSelector(loginEmail)
  const prevAuthMethod = useAppSelector(loginPrevAuthMethod)
  const isFederatedRedirectResultLoading = useAppSelector(
    loginIsFederatedRedirectResultLoading
  )
  const shouldShowHintOfExitenceOfDifferentAuthMethod = useAppSelector(
    loginShouldShowHintOfExitenceOfDifferentAuthMethod
  )
  const shouldShowhintOfCompanyEmail = isCompanyEmail(email)
  const hint = `由於您曾以 ${prevAuthMethod} 帳號登入，請點擊上方「使用 ${prevAuthMethod} 帳號繼續」重試。`
  const hintOfCompanyEmail = `若您想以本公司企業信箱登入，請點擊上方「使用 Google 帳號繼續」重試，以享有 Premium 會員資格。`
  const allowToContinue =
    isValidEmail(email) &&
    isFederatedRedirectResultLoading === false &&
    !shouldShowhintOfCompanyEmail
  const handleOnClick = async () => {
    if (!allowToContinue || isLoading) return
    setIsLoading(true)

    try {
      const responseArray = await fetchSignInMethodsForEmail(auth, email)

      const isEmailExistWithEmailPasswordSignInMethod = responseArray.find(
        (signInMethod) => signInMethod === 'password'
      )

      const isEmailHasBeenUsedByGoogleAuth = responseArray.find(
        (signInMethod) => signInMethod === 'google.com'
      )

      const isEmailHasBeenUsedByFacebookAuth = responseArray.find(
        (signInMethod) => signInMethod === 'facebook.com'
      )

      const isEmailHasBeenUsedByAppleAuth = responseArray.find(
        (signInMethod) => signInMethod === 'apple.com'
      )

      if (isEmailExistWithEmailPasswordSignInMethod) {
        dispatch(loginActions.goToLoginForm())
      } else if (isEmailHasBeenUsedByGoogleAuth) {
        dispatch(loginActions.setSignInWithGoogle())
      } else if (isEmailHasBeenUsedByFacebookAuth) {
        dispatch(loginActions.setSignInWithFacebook())
      } else if (isEmailHasBeenUsedByAppleAuth) {
        dispatch(loginActions.setSignInWithApple())
      } else {
        dispatch(loginActions.goToRegistrationForm())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ThirdPartyButtonGroup>
        {THIRD_PARTY_LIST.map((item) => (
          <ButtonLoginWithThirdParty
            key={item.name}
            thirdPartyName={item.name}
          />
        ))}
        {shouldShowHintOfExitenceOfDifferentAuthMethod && (
          <CenteredHint $state={InputState.Invalid}>{hint}</CenteredHint>
        )}
        {shouldShowhintOfCompanyEmail && (
          <CenteredHint $state={InputState.Invalid}>
            {hintOfCompanyEmail}
          </CenteredHint>
        )}
      </ThirdPartyButtonGroup>
      <Seperator>
        <span>或</span>
      </Seperator>
      <ControlGroup>
        <EmailInput shouldShowHint={false} />
        <PrimaryButton
          isLoading={isLoading}
          disabled={!allowToContinue}
          onClick={handleOnClick}
        >
          下一步
        </PrimaryButton>
        <ReminderSection />
      </ControlGroup>
    </>
  )
}
