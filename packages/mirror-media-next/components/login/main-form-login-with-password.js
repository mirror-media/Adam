import styled from 'styled-components'
import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux'
import {
  loginPassword,
  loginEmail,
  loginActions,
  FormState,
} from '../../slice/login-slice'
import { auth } from '../../firebase'
import {
  getAccessToken,
  errorHandler,
  loginPageOnAuthStateChangeAction,
} from '../../utils/membership'
import { signInWithEmailAndPassword } from 'firebase/auth'
import FormTitle from './form-title'
import GenericPasswordInput from '../shared/inputs/generic-password-input'
import PrimaryButton from '../shared/buttons/primary-button'
import DefaultButton from '../shared/buttons/default-button'
import TextButton from './text-button'
import { FirebaseError } from 'firebase/app'
import { InputState } from '../../constants/form'
import { FirebaseAuthError } from '../../constants/firebase'
import { isValidEmail, isValidPassword } from '../../utils'
import useRedirect from '../../hooks/use-redirect'

// following comments is required since these variables are used by comments but not codes.
/* eslint-disable-next-line no-unused-vars */
const { Start, Invalid } = InputState

/** @typedef {Start | Invalid } PasswordInputState */

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  margin-top: 24px;
  margin-bottom: 24px;
`

export default function MainFormLoginWithPassword() {
  const dispatch = useAppDispatch()
  const email = useAppSelector(loginEmail)
  const password = useAppSelector(loginPassword)
  const allowToSubmit = isValidEmail(email) && isValidPassword(password)
  const { redirect } = useRedirect()

  /** @type {[PasswordInputState, import('react').Dispatch<import('react').SetStateAction<PasswordInputState>>]} */
  const [passwordInputState, setPasswordInputState] = useState(InputState.Start)
  // const shouldShowErrorHint = useAppSelector(loginShouldShowErrorHint)

  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  const handlePasswordOnChange = (e) => {
    dispatch(loginActions.setPassword(e.target.value))
  }
  const [isLoading, setIsLoading] = useState(false)

  /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
  const handleBack = () => {
    setPasswordInputState(InputState.Start)
    dispatch(loginActions.goToStart())
  }

  /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
  const handleSubmit = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      if (!user) {
        throw new Error('Unable to get Firebase User')
      }
      const idToken = await user.getIdToken()
      if (!idToken) {
        throw new Error('Unexpected Error when getting firebase Id token.')
      }
      const accessToken = await getAccessToken(idToken)
      await loginPageOnAuthStateChangeAction(user, false, accessToken)

      redirect()
    } catch (e) {
      if (
        e instanceof FirebaseError &&
        e.code === FirebaseAuthError.WRONG_PASSWORD
      ) {
        setPasswordInputState(InputState.Invalid)
      } else {
        errorHandler(e, {
          userEmail: email,
        })
        dispatch(loginActions.changeState(FormState.LoginFail))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <FormTitle>輸入密碼</FormTitle>
      <GenericPasswordInput
        value={password}
        placeholder="密碼大於 6 位數"
        invalidMessage="密碼錯誤，請重新再試"
        state={passwordInputState}
        onChange={handlePasswordOnChange}
      />
      <ControlGroup>
        <PrimaryButton
          isLoading={isLoading}
          disabled={!allowToSubmit}
          onClick={handleSubmit}
        >
          登入會員
        </PrimaryButton>
        <DefaultButton onClick={handleBack}>回上一步</DefaultButton>
      </ControlGroup>
      <TextButton
        href={{
          pathname: 'recoverPassword',
          query: {
            email,
          },
        }}
      >
        忘記密碼？
      </TextButton>
    </>
  )
}
