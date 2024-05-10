import GenericTextInput from '../shared/inputs/generic-text-input'
import { InputState } from '../../constants/form'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { loginEmail, loginActions } from '../../slice/login-slice'
import { isValidEmail } from '../../utils'

// following comments is required since these variables are used by comments but not codes.
/* eslint-disable-next-line no-unused-vars */
const { Start, Invalid, Valid } = InputState

/** @typedef {Start | Invalid | Valid} EmailInputState */

/**
 * @param {Object} props
 * @param {boolean} [props.shouldShowHint=true] - 是否在顯示提示訊息
 */
export default function EmailInput({ shouldShowHint = true }) {
  const invalidMessage = shouldShowHint ? '請輸入有效的 Email 地址' : ''
  const validMessage = shouldShowHint ? 'Email 格式正確' : ''

  const getValidality = (/** @type {string} */ email) => {
    if (email === '') {
      return InputState.Start
    } else {
      if (isValidEmail(email)) {
        return InputState.Valid
      } else {
        return InputState.Invalid
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

    if (shouldShowHint) {
      setState(getValidality(inputValue))
    }
    dispatch(loginActions.setEmail(inputValue))
  }

  return (
    <GenericTextInput
      placeholder="name@example.com"
      invalidMessage={invalidMessage}
      validMessage={validMessage}
      value={email}
      state={state}
      onChange={handleInputChange}
    />
  )
}
