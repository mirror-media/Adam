import { createSlice } from '@reduxjs/toolkit'

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */

/**
 * @typedef {import('../store').AppThunk} AppThunk
 * @typedef {import('../store').AppState } AppState
 */

/**
 * Type for state
 * @typedef {'form' | 'loginSuccess' | 'registerSuccess' | 'loginError' | 'registerError'} State
 * @typedef { 'Google' | 'Facebook' | 'Apple' | 'email' | ''} PrevAuthMethod
 * @typedef {boolean} ShouldShowHint
 * @typedef {string} Email
 * @typedef {string} Password
 * @typedef {'initial' | 'register' |'login' | 'recoverPassword'} LoginFormMode
 */

/**
 * @typedef {Object} InitialState
 * @property {State} state
 * @property {PrevAuthMethod} prevAuthMethod
 * @property {ShouldShowHint} shouldShowHint
 * @property {Email} email
 * @property {Password} password
 * @property {LoginFormMode} loginFormMode
 */

/**@type {InitialState} */
const initialState = {
  state: 'form',
  prevAuthMethod: '',
  shouldShowHint: false,
  email: '',
  password: '',
  loginFormMode: 'initial',
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
const loginShouldShowHint = (
  /**
   * @type {AppState}
   */
  state
) => state.login.shouldShowHint
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

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    changeState: (
      state,
      /**
       * @type {PayloadAction<State>}
       */
      action
    ) => {
      state.state = action.payload
    },
    setEmail: (
      state,
      /**
       * @type {PayloadAction<Email>}
       */
      action
    ) => {
      state.email = action.payload
    },
    setPassword: (
      state,
      /**
       * @type {PayloadAction<Password>}
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
    changeShouldShowHint: (
      state,
      /**
       * @type {PayloadAction<ShouldShowHint>}
       */
      action
    ) => {
      state.shouldShowHint = action.payload
    },
    resetLoginState: (state) => {
      state.state = 'form'
      state.prevAuthMethod = ''
      state.shouldShowHint = false
      state.email = ''
      state.password = ''
      state.loginFormMode = 'initial'
    },
  },
})

export {
  loginState,
  loginPrevAuthMethod,
  loginShouldShowHint,
  loginEmail,
  loginPassword,
  loginFormMode,
}
export const loginActions = loginSlice.actions

export default loginSlice.reducer
