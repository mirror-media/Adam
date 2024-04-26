import { useState } from 'react'
import { useAppSelector } from '../../hooks/useRedux'
import { useAppDispatch } from '../../hooks/useRedux'
import { loginPassword, loginActions } from '../../slice/login-slice'
import { isValidPassword } from '../../utils'
import GenericPasswordInput from '../shared/inputs/generic-password-input'
import { InputState } from '../../constants/form'

// following comments is required since these variables are used by comments but not codes.
/* eslint-disable-next-line no-unused-vars */
const { Start, Incomplete, Valid } = InputState

/** @typedef {Start | Incomplete | Valid } PasswordInputState */

export default function RegistrationPasswordInput() {
  const getValidality = (/** @type {string} */ password) => {
    if (password === '') {
      return InputState.Start
    } else {
      if (isValidPassword(password)) {
        return InputState.Valid
      } else {
        return InputState.Incomplete
      }
    }
  }

  const dispatch = useAppDispatch()
  const password = useAppSelector(loginPassword)

  /** @type {[PasswordInputState, import('react').Dispatch<import('react').SetStateAction<PasswordInputState>>]} */
  const [state, setState] = useState(getValidality(password))

  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  const handleOnChange = (e) => {
    const inputValue = e.target.value

    setState(getValidality(inputValue))
    dispatch(loginActions.setPassword(inputValue))
  }

  return (
    <GenericPasswordInput
      value={password}
      placeholder="密碼須在 6 位數以上"
      validMessage="密碼在 6 位數以上"
      incompleteMessage="密碼在 6 位數以上"
      state={state}
      onChange={handleOnChange}
    />
  )
}
