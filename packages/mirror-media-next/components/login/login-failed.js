import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { loginActions, loginFormMode, FormMode } from '../../slice/login-slice'
import GenericFailed from './generic-failed'

export default function LoginFailed() {
  const formMode = useAppSelector(loginFormMode)
  const dispatch = useAppDispatch()

  const handleBack = () => {
    if (formMode === FormMode.Start) {
      return dispatch(loginActions.goToStart())
    } else if (formMode === FormMode.Login) {
      return dispatch(loginActions.goToLoginForm())
    }
  }

  return <GenericFailed primaryText="請回上一頁重新登入" onBack={handleBack} />
}
