import { useState } from 'react'
import { useRouter } from 'next/router'

import styled from 'styled-components'
import Image from 'next/image'

const CopiedMessage = styled.div`
  position: fixed;
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  background: rgba(0, 0, 0, 0.87);
  border-radius: 2px;
  z-index: 100;
  margin: 0 auto;
  width: 80vw;
  max-width: 480px;
  padding: 12px;
  visibility: ${
    /**
     * @param {{shouldShowMessage: Boolean}} param
     */
    ({ shouldShowMessage }) => (shouldShowMessage ? 'visible' : 'hidden')
  };
  opacity: ${
    /**
     * @param {{shouldShowMessage: Boolean}} param
     */
    ({ shouldShowMessage }) => (shouldShowMessage ? 1 : 0)
  };

  transition: all 0.3s ease-in;
`

const ClickButton = styled.button`
  &:focus {
    outline: none;
  }
`

export default function ButtonCopyLink() {
  const [shouldShowMessage, setShouldShowMessage] = useState(false)
  const { asPath } = useRouter()
  const handleCopyLink = () => {
    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://www.mirrormedia.mg'

    const URL = `${origin}${asPath}`
    window.navigator.clipboard.writeText(URL)

    setShouldShowMessage(true)
    const timeout = setTimeout(() => {
      clearTimeout(timeout)
      setShouldShowMessage(false)
    }, 3000)
  }
  return (
    <>
      <CopiedMessage shouldShowMessage={shouldShowMessage}>
        已複製連結
      </CopiedMessage>

      <ClickButton onClick={handleCopyLink}>
        <Image
          src={'/images/link-logo.svg'}
          width={35}
          height={35}
          alt="copy link button"
        ></Image>
      </ClickButton>
    </>
  )
}
