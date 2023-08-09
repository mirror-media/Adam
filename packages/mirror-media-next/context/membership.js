import { createContext, useReducer, useContext, useEffect } from 'react'
import { auth } from '../firebase'
import { signOut } from '@firebase/auth'
import axios from 'axios'
import { WEEKLY_API_SERVER_ORIGIN, API_TIMEOUT } from '../config/index.mjs'

/**
 * @typedef {Object} MemberInfo
 * @property {MemberType} memberType
 */

/**
 * @typedef {Object} Membership
 * @property {boolean} isLoggedIn
 * @property {string} accessToken
 * @property {MemberInfo} memberInfo
 * @property {boolean} isLogInProcessFinished
 */

/**
 * @typedef {Object} MembershipReducerAction
 * @property {"LOGIN" | "LOGOUT"} type
 * @property {Object} [payload]
 * @property {Membership["accessToken"]} [payload.accessToken]
 * @property {MemberInfo} [payload.memberInfo]
 */

/**
 * @typedef { 'not-member' |'basic-member' | 'premium-member' | 'one-time-member' | 'one-time-member'} MemberType
 */

/**
 * TODO: check which data should be stored, such as user email, is email verified, etc.
 * @type {Membership}
 */
const initialMembership = {
  isLoggedIn: false,
  accessToken: '',
  memberInfo: { memberType: 'not-member' },
  isLogInProcessFinished: false,
}

/**
 * @typedef {import('react').Dispatch<MembershipReducerAction>} MembershipDispatch
 */

const MembershipContext = createContext(initialMembership)

/** @type {import('react').Context<MembershipDispatch>} */
const MembershipDispatchContext = createContext(null)

/**
 *
 * @param {Membership} membership
 * @param {MembershipReducerAction} action
 * @returns {Membership}
 */
const membershipReducer = (membership, action) => {
  const { memberInfo } = membership
  const isLogInProcessFinished = true
  switch (action.type) {
    case 'LOGIN':
      const {
        memberInfo: { memberType = 'not-member' } = {},
        accessToken = '',
      } = action?.payload
      return {
        isLoggedIn: true,
        accessToken: accessToken,
        memberInfo: {
          ...memberInfo,
          memberType: memberType,
        },
        isLogInProcessFinished,
      }
    case 'LOGOUT':
      return {
        isLoggedIn: false,
        accessToken: '',
        memberInfo: {
          memberType: 'not-member',
        },
        isLogInProcessFinished,
      }

    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

/**
 * The context provider for managing membership state.
 * The provider not only manage membership state, but also login membership if needed.
 * The process of login membership contain five steps:
 * 1. Add an observer `auth.onAuthStateChanged` to detect whether firebase is sign-in or not.
 * 2. If firebase is sign-in, then get firebase id token.
 * 3. If successfully get firebase id token, then get Access Token, which is sign by WAS (weekly-api-server).
 * 4. If successfully get Access Token, then dispatch a `LOGIN` action, which will store value of Access Token.
 * 5. If firebase is NOT sign-in, or firebase id token is verified invalid by WAS, then dispatch a `LOGOUT` action, which will clear the value of Access Token which previously stored.
 *
 * Please remind two things:
 * 1. "Get Access Token" is an essential piece for login process: if user couldn't get Access Token, it should not be treated as login completely.
 * 2. Sign-in/sign-out to firebase is only part of the login/logout process:
 *    - After firebase sign-in, it is needed get Access token, and dispatch a "LOGIN" action to store access token.
 *    - After firebase sign-out, it is needed to dispatch a "LOGOUT" action to clear access token.
 *
 * @param {Object} props
 * @param {JSX.Element} props.children
 * @returns {JSX.Element}
 */
const MembershipProvider = ({ children }) => {
  const [membership, dispatch] = useReducer(
    membershipReducer,
    initialMembership
  )

  useEffect(() => {
    /**
     * Use function `getIdToken` to get a Firebase JWT Token
     * Return a token string if success, return null if failed.
     * If return `null`, which means some unexpected error occurred on Firebase.
     * @see https://firebase.google.com/docs/reference/js/auth.user.md#usergetidtoken
     *
     * @param {import('firebase/auth').User} user
     * @returns {Promise<import('firebase/auth').IdTokenResult["token"]| null>}
     */
    const getIdToken = async (user) => {
      try {
        const idToken = await user.getIdToken()
        return idToken
      } catch (err) {
        console.warn(err)
        return null
      }
    }

    /**
     * @param {string} accessToken
     * @returns {MemberType}
     */
    const getMemberType = (accessToken) => {
      try {
        const JwtPayload = accessToken.split('.')[1]

        const buffer = Buffer.from(JwtPayload, 'base64')
        const decodedString = buffer.toString('utf-8')
        const decodedJwtPayload = JSON.parse(decodedString)
        const memberType = decodedJwtPayload.roles[0]
        return memberType
      } catch (e) {
        //TODO: If unable to decode Jwt payload, it is needed to send error log to our GCP log viewer by using [Beacon API](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API).
        console.warn(e)
        return 'not-member'
      }
    }
    const handleFirebaseAuthStateChanged = async (user) => {
      if (user) {
        const idToken = await getIdToken(user)

        if (!idToken) {
          return
        }

        /**
         * Get user Access Token.
         * Access Token is generated by WAS(weekly-api-server).
         * It is need to send post request to `/access-token` and set Firebase id token as a authorization header,
         * WAS will verify Firebase id token and return Access Token if success.
         * By using Access Token, user can access information of certain member account, read member article if has corresponding permissions.
         * @see https://github.com/mirror-media/Adam/blob/dev/packages/weekly-api-server/README.md
         */
        try {
          const res = await axios({
            method: 'post',
            url: `https://${WEEKLY_API_SERVER_ORIGIN}/access-token`,
            headers: {
              authorization: `Bearer ${idToken}`,
            },
            timeout: API_TIMEOUT,
          })
          const accessToken = res?.data?.data['access_token']

          const memberType = getMemberType(accessToken)

          if (accessToken) {
            dispatch({
              type: 'LOGIN',
              payload: { accessToken, memberInfo: { memberType } },
            })
            console.log('Has access token, hurray!')
          }
        } catch (error) {
          /**
           * There are two situations that need to be handled:
           * 1. Firebase id Token is verified by WAS, but it is an invalid id token. The status code is 401.
           * 2. WAS has some unexpected error, such as unable to sign in JWT token, or unable to request GQL server. The status code is 500.
           */
          const statusCode = error?.response?.status
          switch (statusCode) {
            case 401:
              //Logout firebase
              signOut(auth)
              break
            case 500:
              // TODO: Send this error to our GCP log viewer by using [Beacon API](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API).

              console.warn(error)
              break
            default:
              console.warn(error)
              break
          }
        }
      } else {
        /**
         * If user is not log in firebase, we should dispatch a "LOGOUT" action to clear access token.
         */
        dispatch({ type: 'LOGOUT' })
      }
    }

    auth.onAuthStateChanged(handleFirebaseAuthStateChanged)
  }, [])
  return (
    <MembershipContext.Provider value={membership}>
      <MembershipDispatchContext.Provider value={dispatch}>
        {children}
      </MembershipDispatchContext.Provider>
    </MembershipContext.Provider>
  )
}
/**
 * This context provide the value of property in membership, such as `isLoggedIn`, `accessToken`.
 */
const useMembership = () => {
  return useContext(MembershipContext)
}

/**
 * This context provide the function that lets components dispatch actions to set value of property in membership.
 */
const useMembershipDispatch = () => {
  return useContext(MembershipDispatchContext)
}

const handleFirebaseSignOut = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.warn(error)
  }
}
export {
  handleFirebaseSignOut as logout,
  MembershipProvider,
  useMembership,
  useMembershipDispatch,
}
