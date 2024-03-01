import { useState, useMemo } from 'react'
import { auth } from '../../firebase'
import {
  OAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithRedirect,
} from 'firebase/auth'
/** @typedef {'Google' | 'Facebook' | 'Apple'} ThirdPartyName */

/**
 *
 * @param {React.ComponentProps<'button'> & {thirdPartyName: ThirdPartyName}} props
 * @returns
 */
export default function ContainerMembershipLoginWithThirdParty({
  thirdPartyName,
}) {
  const provider = useMemo(() => {
    let provider = null
    switch (thirdPartyName) {
      case 'Google':
        provider = new GoogleAuthProvider()
        break
      case 'Facebook':
        provider = new FacebookAuthProvider()
        break
      case 'Apple':
        provider = new OAuthProvider('apple.com')
        break
    }
    provider.addScope('email')
    return provider
  }, [thirdPartyName])

  const [isLoading, setIsLoading] = useState(false)
  const handleThirdPartyFirebaseLogin = async () => {
    setIsLoading(true)
    await signInWithRedirect(auth, provider)
  }
  return (
    <button onClick={handleThirdPartyFirebaseLogin}>
      {isLoading ? (
        <span>載入中...</span>
      ) : (
        <span>第三方{thirdPartyName}登入</span>
      )}
    </button>
  )
}
