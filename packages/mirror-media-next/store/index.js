//See examples: https://github.com/vercel/next.js/tree/09f235d9be8d3c6ae23bfad1baccdf68bd501390/examples/with-redux
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../slice/login-slice'
/**
 * @typedef {ReturnType<typeof store.getState>} AppState
 * @typedef {typeof store.dispatch} AppDispatch
 * @typedef {import('@reduxjs/toolkit').Action<string>} Action
 */

/**
 * @template [T=void]
 * @typedef {import('@reduxjs/toolkit').ThunkAction<T, AppState, unknown, import('redux').Action<string>>} AppThunk
 */

// create a makeStore function

const makeStore = () => configureStore({ reducer: { counter: counterReducer } })
const store = makeStore()

export default store
