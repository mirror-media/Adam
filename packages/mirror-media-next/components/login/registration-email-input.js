import GenericTextInput from '../shared/inputs/generic-text-input'
import { InputState } from '../../constants/form'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { loginEmail, loginActions } from '../../slice/login-slice'
import { isValidEmail } from '../../utils'

// following comments is required since these variables are used by comments but not codes.
/* eslint-disable-next-line no-unused-vars */
const { Start, Incomplete, Valid } = InputState

/** @typedef {Start | Incomplete | Valid} EmailInputState */

export default function RegistartionEmailInput() {
  const getValidality = (/** @type {string} */ email) => {
    if (email === '') {
      return InputState.Start
    } else {
      if (isValidEmail(email)) {
        return InputState.Valid
      } else {
        return InputState.Incomplete
      }
    }
  }

  const dispatch = useAppDispatch()
  const email = useAppSelector(loginEmail)
  /** @type {[EmailInputState, import('react').Dispatch<import('react').SetStateAction<EmailInputState>>]} */
  const [state, setState] = useState(getValidality(email))

  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  const handleInputChange = (e) => {
    const inputValue = e.target.value

    setState(getValidality(inputValue))
    dispatch(loginActions.setEmail(inputValue))
  }

  return (
    <GenericTextInput
      placeholder="name@example.com"
      incompleteMessage="Email 格式正確"
      validMessage="Email 格式正確"
      value={email}
      state={state}
      onChange={handleInputChange}
    />
  )
}
