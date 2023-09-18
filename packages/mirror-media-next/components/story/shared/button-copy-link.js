//REMINDER: DO NOT REMOVE className which has prefix `GTM-`, since it is used for collecting data of Google Analytics event.

import { useState } from 'react'

import styled from 'styled-components'
import Image from 'next/image'
import useSharedUrl from '../../../hooks/use-shared-url'
const CopiedMessage = styled.div`
  position: fixed;
  top: 64px;
  left: calc((100vw - min(80vw, 480px)) / 2);
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

/**
 * @param {Object} props
 * @param {number} [props.width] - width of the button
 * @param {number} [props.height] - height of the button
 * @returns {JSX.Element}
 */
export default function ButtonCopyLink({ width = 35, height = 35 }) {
  const [shouldShowMessage, setShouldShowMessage] = useState(false)
  const sharedUrl = useSharedUrl()
  const handleCopyLink = () => {
    if (window.navigator.clipboard) {
      /**
       * Since `window.navigator.clipboard` is only available in https protocol,
       * we add optional chaining to hide error when developing in http protocol, such as `http://localhost:3000`
       * Must to know that this is a work-around solution, not solved problem of unable copy in http protocol.
       */
      window.navigator?.clipboard?.writeText(sharedUrl)

      setShouldShowMessage(true)
      const timeout = setTimeout(() => {
        clearTimeout(timeout)
        setShouldShowMessage(false)
      }, 3000)
    }
  }
  return (
    <>
      <CopiedMessage shouldShowMessage={shouldShowMessage}>
        已複製連結
      </CopiedMessage>

      <ClickButton
        onClick={handleCopyLink}
        // @ts-ignore
        on="tap:clipboard-example.copy"
      >
        <Image
          src={'/images-next/link-logo.svg'}
          width={width}
          height={height}
          className="GTM-share-link"
          alt="copy link button"
        ></Image>
      </ClickButton>

      <input
        id="clipboard-example"
        type="text"
        value={sharedUrl}
        readOnly
        style={{ position: 'absolute', left: '-9999px' }}
      />
    </>
  )
}
