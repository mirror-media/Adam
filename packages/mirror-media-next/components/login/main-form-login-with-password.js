import { useState } from 'react'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'
import styled from 'styled-components'

import { FirebaseAuthError } from '../../constants/firebase'
import { InputState } from '../../constants/form'
import { auth } from '../../firebase'
import useRedirect from '../../hooks/use-redirect'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import {
  FormState,
  loginActions,
  loginEmail,
  loginPassword,
} from '../../slice/login-slice'
import { isValidEmail, isValidPassword } from '../../utils'
import {
  errorHandler,
  getAccessToken,
  loginPageOnAuthStateChangeAction,
} from '../../utils/membership'
import DefaultButton from '../shared/buttons/default-button'
import PrimaryButton from '../shared/buttons/primary-button'
import GenericPasswordInput from '../shared/inputs/generic-password-input'

import FormTitle from './form-title'
import TextButton from './text-button'

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

  const [passwordInputState, setPasswordInputState] = useState(
    /** @type {PasswordInputState} */ (InputState.Start)
  )
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
      <TextButton href={{ pathname: '/recover-password', query: { email } }}>
        忘記密碼？
      </TextButton>
    </>
  )
}
