import styled from 'styled-components'
import { useMemo } from 'react'
import { auth } from '../../firebase'
import {
  OAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithRedirect,
} from 'firebase/auth'

import { useAppSelector, useAppDispatch } from '../../hooks/useRedux'
import {
  loginIsFederatedRedirectResultLoading,
  loginActions,
  AuthMethod,
} from '../../slice/login-slice'
import DefaultButton from '../shared/buttons/default-button'
import IconFacebook from '../../public/images-next/login/facebook.svg'
import IconGoogle from '../../public/images-next/login/google.svg'
import IconApple from '../../public/images-next/login/apple.svg'

// following comments is required since these variables are used by comments but not codes.
/* eslint-disable-next-line no-unused-vars */
const { Google, Facebook, Apple } = AuthMethod
/** @typedef {Google | Facebook | Apple} ThirdPartyName */

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;

  > svg {
    width: 20px;
    height: 20px;
  }

  > p {
    font-size: 18px;
    font-weight: 500;
    line-height: 150%;
  }
`

/**
 * @param {React.ComponentProps<'button'> & {thirdPartyName: ThirdPartyName}} props
 */
export default function ButtonLoginWithThirdParty({ thirdPartyName }) {
  const dispatch = useAppDispatch()
  const isFederatedRedirectResultLoading = useAppSelector(
    loginIsFederatedRedirectResultLoading
  )
  const provider = useMemo(() => {
    let provider = null
    switch (thirdPartyName) {
      case AuthMethod.Google:
        provider = new GoogleAuthProvider()
        break
      case AuthMethod.Facebook:
        provider = new FacebookAuthProvider()
        break
      case AuthMethod.Apple:
        provider = new OAuthProvider('apple.com')
        break
    }
    provider.addScope('email')
    return provider
  }, [thirdPartyName])

  const SvgIcon = useMemo(() => {
    switch (thirdPartyName) {
      case AuthMethod.Google:
        return IconGoogle
      case AuthMethod.Facebook:
        return IconFacebook
      case AuthMethod.Apple:
        return IconApple
    }
  }, [thirdPartyName])

  const handleThirdPartyFirebaseLogin = async () => {
    if (isFederatedRedirectResultLoading) return
    dispatch(loginActions.changeIsFederatedRedirectResultLoading(true))
    await signInWithRedirect(auth, provider)
  }

  return (
    <DefaultButton
      isLoading={isFederatedRedirectResultLoading}
      onClick={handleThirdPartyFirebaseLogin}
    >
      <Wrapper>
        <SvgIcon />
        <p>以 {thirdPartyName} 帳號繼續</p>
      </Wrapper>
    </DefaultButton>
  )
}
