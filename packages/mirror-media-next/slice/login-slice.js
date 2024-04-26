import { createSlice } from '@reduxjs/toolkit'

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */

/**
 * @typedef {import('../store').AppThunk} AppThunk
 * @typedef {import('../store').AppState } AppState
 */

const Start = 'start'
const Registration = 'registration'
const Login = 'login'
/**
 * @readonly
 */
const FormMode = /** @type {const} */ ({
  Start,
  Registration,
  Login,
})

const Form = 'form'
const LoginSuccess = 'login-success'
const LoginFail = 'login-fail'
const RegisterSuccess = 'register-success'
const RegisterFail = 'register-fail'
/**
 * @readonly
 */
const FormState = /** @type {const} */ ({
  Form,
  LoginSuccess,
  LoginFail,
  RegisterSuccess,
  RegisterFail,
})

const Google = 'Google'
const Facebook = 'Facebook'
const Apple = 'Apple'
const Email = 'email'
const Default = ''
/**
 * @readonly
 */
const AuthMethod = /** @type {const} */ ({
  Google,
  Facebook,
  Apple,
  Email,
  Default,
})

/**
 * Type for state
 * @typedef {Form | LoginSuccess | LoginFail | RegisterSuccess | RegisterFail} LoginFormState
 * @typedef {Start | Registration | Login} LoginFormMode
 * @typedef {Google | Facebook | Apple | Email | Default} PrevAuthMethod
 */

/**
 * @typedef {Object} InitialState
 * @property {LoginFormState} state - 頁面狀態
 * @property {LoginFormMode} loginFormMode - 頁面狀態為 Form 的情況下，對話框的狀態
 * @property {PrevAuthMethod} prevAuthMethod - 先前登入所使用的方法
 * @property {boolean} shouldShowHintOfExitenceOfDifferentAuthMethod - 是否顯示已使用其他方式註冊的提示
 * @property {string} email - 輸入的 E-mail
 * @property {string} password - 輸入的密碼
 * @property {boolean} isFederatedRedirectResultLoading - 第三方登入是否正在處理中
 */

/**@type {InitialState} */
const initialState = {
  state: FormState.Form,
  loginFormMode: FormMode.Start,
  prevAuthMethod: AuthMethod.Default,
  shouldShowHintOfExitenceOfDifferentAuthMethod: false,
  email: '',
  password: '',
  isFederatedRedirectResultLoading: true,
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

const loginState = (
  /**
   * @type {AppState}
   */
  state
) => state.login.state
const loginPrevAuthMethod = (
  /**
   * @type {AppState}
   */
  state
) => state.login.prevAuthMethod
const loginShouldShowHintOfExitenceOfDifferentAuthMethod = (
  /**
   * @type {AppState}
   */
  state
) => state.login.shouldShowHintOfExitenceOfDifferentAuthMethod
const loginEmail = (
  /**
   * @type {AppState}
   */
  state
) => state.login.email
const loginPassword = (
  /**
   * @type {AppState}
   */
  state
) => state.login.password
const loginFormMode = (
  /**
   * @type {AppState}
   */
  state
) => state.login.loginFormMode

const loginIsFederatedRedirectResultLoading = (
  /**
   * @type {AppState}
   */
  state
) => state.login.isFederatedRedirectResultLoading

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    changeState: (
      state,
      /**
       * @type {PayloadAction<LoginFormState>}
       */
      action
    ) => {
      state.state = action.payload
    },
    setEmail: (
      state,
      /**
       * @type {PayloadAction<string>}
       */
      action
    ) => {
      state.email = action.payload
    },
    setPassword: (
      state,
      /**
       * @type {PayloadAction<string>}
       */
      action
    ) => {
      state.password = action.payload
    },

    changeLoginFormMode: (
      state,
      /**
       * @type {PayloadAction<LoginFormMode>}
       */
      action
    ) => {
      state.loginFormMode = action.payload
    },
    clearPassword: (state) => {
      state.password = ''
    },
    changePrevAuthMethod: (
      state,
      /**
       * @type {PayloadAction<PrevAuthMethod>}
       */
      action
    ) => {
      state.prevAuthMethod = action.payload
    },
    changeShouldShowHintOfExitenceOfDifferentAuthMethod: (
      state,
      /**
       * @type {PayloadAction<boolean>}
       */
      action
    ) => {
      state.shouldShowHintOfExitenceOfDifferentAuthMethod = action.payload
    },
    changeIsFederatedRedirectResultLoading: (
      state,
      /**
       * @type {import('@reduxjs/toolkit').PayloadAction<boolean>}
       */
      action
    ) => {
      state.isFederatedRedirectResultLoading = action.payload
    },
    resetLoginState: (state) => {
      state.state = FormState.Form
      state.prevAuthMethod = AuthMethod.Default
      state.shouldShowHintOfExitenceOfDifferentAuthMethod = false
      state.email = ''
      state.password = ''
      state.loginFormMode = FormMode.Start
    },
    goToStart: (state) => {
      state.state = FormState.Form
      state.loginFormMode = FormMode.Start
      state.password = ''
      state.shouldShowHintOfExitenceOfDifferentAuthMethod = false
    },
    goToLoginForm: (state) => {
      state.state = FormState.Form
      state.loginFormMode = FormMode.Login
      state.prevAuthMethod = AuthMethod.Email
    },
    goToRegistrationForm: (state) => {
      state.state = FormState.Form
      state.loginFormMode = FormMode.Registration
    },
    setSignInWithGoogle: (state) => {
      state.prevAuthMethod = AuthMethod.Google
      state.shouldShowHintOfExitenceOfDifferentAuthMethod = true
    },
    setSignInWithFacebook: (state) => {
      state.prevAuthMethod = AuthMethod.Facebook
      state.shouldShowHintOfExitenceOfDifferentAuthMethod = true
    },
    setSignInWithApple: (state) => {
      state.prevAuthMethod = AuthMethod.Apple
      state.shouldShowHintOfExitenceOfDifferentAuthMethod = true
    },
  },
})

export {
  loginState,
  loginPrevAuthMethod,
  loginShouldShowHintOfExitenceOfDifferentAuthMethod,
  loginEmail,
  loginPassword,
  loginFormMode,
  loginIsFederatedRedirectResultLoading,
  FormMode,
  FormState,
  AuthMethod,
}
export const loginActions = loginSlice.actions

export default loginSlice.reducer
