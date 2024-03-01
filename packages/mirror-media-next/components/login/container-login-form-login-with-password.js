import { useState } from 'react'
import UiMembershipInput from './ui/input/ui-membership-input'
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux'
import {
  loginPassword,
  loginEmail,
  loginActions,
} from '../../slice/login-slice'
import { auth } from '../../firebase'
import {
  getAccessToken,
  errorHandler,
  loginPageOnAuthStateChangeAction,
} from '../../utils/membership'
import { signInWithEmailAndPassword } from 'firebase/auth'

import UiMembershipButton from './ui/button/ui-membership-button'
import { FirebaseError } from 'firebase/app'
export default function ContainerLoginFormLoginWithPassword() {
  const dispatch = useAppDispatch()
  const password = useAppSelector(loginPassword)
  const email = useAppSelector(loginEmail)
  const [shouldShowErrorHint, setShouldShowErrorHint] = useState(false)
  // const shouldShowErrorHint = useAppSelector(loginShouldShowErrorHint)
  const handlePasswordOnChange = (e) => {
    dispatch(loginActions.setPassword(e.target.value))
  }
  const [shouldRevealPassword, setShouldRevealPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleRevealPasswordButtonClick = () => {
    setShouldRevealPassword((pre) => !pre)
  }
  //TODO: better name
  const handleGoBack = () => {
    dispatch(loginActions.changeLoginFormMode('initial'))
    dispatch(loginActions.clearPassword())
    setShouldShowErrorHint(false)
  }
  const handleSubmit = async () => {
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
      const result = await loginPageOnAuthStateChangeAction(
        user,
        false,
        accessToken
      )
      dispatch(loginActions.changeState(result))
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)

      if (e instanceof FirebaseError && e.code === 'auth/wrong-password') {
        setShouldShowErrorHint(true)
      } else {
        errorHandler(e)
        dispatch(loginActions.changeState('loginError'))
      }
    }
  }
  return (
    <div>
      登入模式
      <br></br>
      <UiMembershipInput
        placeholder="密碼大於六位數"
        value={password}
        type={shouldRevealPassword ? 'text' : 'password'}
        onChange={handlePasswordOnChange}
      ></UiMembershipInput>
      <br></br>
      <button onClick={handleRevealPasswordButtonClick}>
        {shouldRevealPassword ? '隱藏密碼' : '顯示密碼'}
      </button>
      <br></br>
      <UiMembershipButton buttonType="primary" handleOnClick={handleSubmit}>
        <p>{isLoading ? '載入中' : '登入'}</p>
      </UiMembershipButton>
      <br></br>
      <UiMembershipButton buttonType="secondary" handleOnClick={handleGoBack}>
        <p>回上一步</p>
      </UiMembershipButton>
      {shouldShowErrorHint && <p>密碼錯誤，請重新嘗試</p>}
    </div>
  )
}
