import styled from 'styled-components'
import { useState } from 'react'
import { InputState } from '../../constants/form'
import { isValidPassword } from '../../utils'
import { auth } from '../../firebase'
import GenericPasswordInput from '../shared/inputs/generic-password-input'
import PrimaryButton from '../shared/buttons/primary-button'
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth'
import { generateErrorReportInfo } from '../../utils/log/error-log'
import { sendErrorLog } from '../../utils/log/send-log'
import { useRouter } from 'next/router'

// following comments is required since these variables are used by comments but not codes.
/* eslint-disable-next-line no-unused-vars */
const { Start, Incomplete, Valid, Invalid } = InputState

/**
 * @typedef { Start | Invalid} OldPasswordState
 * @typedef { Start | Incomplete | Valid} NewPasswordState
 */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  margin-top: 16px;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`

const FieldLabel = styled.label`
  color: rgba(0, 0, 0, 0.87);
  font-size: 18px;
  font-weight: 400;
  line-height: 150%;
`

export default function MainForm() {
  const getValidality = (/** @type {string} */ password) => {
    if (isValidPassword(password)) {
      return InputState.Valid
    } else {
      return InputState.Incomplete
    }
  }

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [oldPassword, setOldPassword] = useState('')
  const [oldPasswordState, setOldPasswordState] = useState(
    /** @type {OldPasswordState} */ (InputState.Start)
  )

  const [newPassword, setNewPassword] = useState('')
  const newPasswordState = getValidality(newPassword)

  const [newPasswordCheck, setNewPassworkCheck] = useState('')
  const newPasswordCheckState =
    newPassword === ''
      ? InputState.Incomplete
      : newPassword === newPasswordCheck
      ? InputState.Valid
      : InputState.Incomplete

  /** @type {import('react').PointerEventHandler<HTMLButtonElement>} */
  const handleOnClickButton = async () => {
    if (isLoading) return

    setIsLoading(true)

    const email = auth?.currentUser?.email
    /** @type {import('firebase/auth').UserCredential} */
    let userCredential

    try {
      userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        oldPassword
      )
    } catch (e) {
      const errorReport = generateErrorReportInfo(e, { userEmail: email })
      sendErrorLog(errorReport)
      setOldPasswordState(InputState.Invalid)
      setIsLoading(false)
      return
    }

    try {
      await updatePassword(userCredential?.user, newPassword)
      router.push('/password-change-success')
    } catch (e) {
      const errorReport = generateErrorReportInfo(e, { userEmail: email })
      sendErrorLog(errorReport)
      router.push({
        pathname: '/password-change-fail',
        query: { from: router.pathname },
      })
    }
    setIsLoading(false)
  }

  return (
    <Form>
      <FieldGroup>
        <FieldLabel>請輸入目前密碼</FieldLabel>
        <GenericPasswordInput
          placeholder="目前密碼"
          invalidMessage="密碼錯誤，請重新再試"
          onChange={(e) => setOldPassword(e.target.value)}
          value={oldPassword}
          state={oldPasswordState}
        />
      </FieldGroup>
      <FieldGroup>
        <FieldLabel>請輸入新密碼</FieldLabel>
        <GenericPasswordInput
          placeholder="密碼須在 6 位數以上"
          incompleteMessage="密碼在 6 位數以上"
          validMessage="密碼在 6 位數以上"
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          state={newPasswordState}
        />
      </FieldGroup>
      <FieldGroup>
        <FieldLabel>請再次輸入新密碼</FieldLabel>
        <GenericPasswordInput
          placeholder="再次輸入新密碼"
          incompleteMessage="兩次密碼須相符"
          validMessage="兩次密碼須相符"
          onChange={(e) => setNewPassworkCheck(e.target.value)}
          value={newPasswordCheck}
          state={newPasswordCheckState}
        />
      </FieldGroup>
      <PrimaryButton
        disabled={newPasswordCheckState !== InputState.Valid}
        isLoading={isLoading}
        onClick={handleOnClickButton}
      >
        儲存
      </PrimaryButton>
    </Form>
  )
}
