import { useAppSelector } from '../../hooks/useRedux'
import { loginFormMode } from '../../slice/login-slice'
import ContainerLoginFormInitial from './container-login-form-initial'
import ContainerLoginFormRecoverPassword from './container-login-form-recover-password'
import ContainerLoginFormRegisterWithEmailPassword from './container-login-form-register-with-email-password'
import ContainerLoginFormLoginWithPassword from './container-login-form-login-with-password'
/**
 * @template T
 * @typedef {[T, React.Dispatch<React.SetStateAction<T>>]} UseState
 */

export default function ContainerLoginForm() {
  const formMode = useAppSelector(loginFormMode)

  const getJsx = () => {
    switch (formMode) {
      case 'initial':
        return <ContainerLoginFormInitial></ContainerLoginFormInitial>
      case 'register':
        return (
          <ContainerLoginFormRegisterWithEmailPassword></ContainerLoginFormRegisterWithEmailPassword>
        )
      case 'login':
        return (
          <ContainerLoginFormLoginWithPassword></ContainerLoginFormLoginWithPassword>
        )
      case 'recoverPassword':
        return (
          <ContainerLoginFormRecoverPassword></ContainerLoginFormRecoverPassword>
        )
    }
  }
  const jsx = getJsx()
  return (
    <div>
      ContainerLoginForm
      {jsx}
    </div>
  )
}
