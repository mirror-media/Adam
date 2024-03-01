import { useState } from 'react'
import UiMembershipInput from './ui/input/ui-membership-input'
import UiMembershipButton from './ui/button/ui-membership-button'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import {
  loginEmail,
  loginPassword,
  loginActions,
} from '../../slice/login-slice'
import {
  getAccessToken,
  loginPageOnAuthStateChangeAction,
  errorHandler,
} from '../../utils/membership'
import { auth } from '../../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
export default function ContainerLoginFormRegisterWithEmailPassword() {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [isDuplicateEmailMember, setIsDuplicateEmailMember] = useState(false)
  const email = useAppSelector(loginEmail)
  const password = useAppSelector(loginPassword)
  const handleEmailOnChange = (e) => {
    dispatch(loginActions.setEmail(e.target.value))
  }
  const handlePasswordOnChange = (e) => {
    dispatch(loginActions.setPassword(e.target.value))
  }
  //TODO: better name
  const handleGoBack = () => {
    dispatch(loginActions.changeLoginFormMode('initial'))
    setIsDuplicateEmailMember(false)
    dispatch(loginActions.clearPassword())
  }
  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
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
        true,
        accessToken
      )
      dispatch(loginActions.changeState(result))
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
      if (
        e instanceof FirebaseError &&
        e?.code === 'auth/email-already-in-use'
      ) {
        setIsDuplicateEmailMember(true)
      } else {
        errorHandler(e)
        dispatch(loginActions.changeState('registerError'))
      }
    }
  }
  return (
    <div>
      Email 註冊：
      <br></br>
      <UiMembershipInput
        type="email"
        value={email}
        placeholder="name@example.com"
        onChange={handleEmailOnChange}
      ></UiMembershipInput>
      <br></br>
      <UiMembershipInput
        type="password"
        value={password}
        onChange={handlePasswordOnChange}
        placeholder="密碼大於六位數"
      ></UiMembershipInput>
      <br></br>
      {isDuplicateEmailMember && <p>這個 Email 已經註冊過囉</p>}
      <UiMembershipButton buttonType="primary" handleOnClick={handleSubmit}>
        <p>{isLoading ? '載入中' : '註冊'}</p>
      </UiMembershipButton>
      <br></br>
      <UiMembershipButton buttonType="secondary" handleOnClick={handleGoBack}>
        <p>回上一步</p>
      </UiMembershipButton>
    </div>
  )
}
