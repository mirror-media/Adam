import UiMembershipInput from './ui/input/ui-membership-input'

import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { loginEmail, loginActions } from '../../slice/login-slice'
export default function UiMembershipInputEmailInvalidation({}) {
  const dispatch = useAppDispatch()
  const email = useAppSelector(loginEmail)
  const handleEmailOnChange = (e) => {
    dispatch(loginActions.setEmail(e.target.value))
  }
  return (
    <div>
      <UiMembershipInput
        placeholder="name@example.com"
        value={email}
        onChange={handleEmailOnChange}
        type="email"
      ></UiMembershipInput>
      <p>todo: hint ( 請輸入有效 Email 地址 )</p>
    </div>
  )
}
