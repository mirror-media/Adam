import { useRef, useState } from 'react'
import styled from 'styled-components'

import { Z_INDEX } from '../constants'

const Popup = styled.div<{ shouldShowMessage: boolean }>`
  position: fixed;
  top: 40px;
  left: calc((100vw - 100px) / 2);
  color: #fff;
  background: rgba(0, 0, 0, 0.87);
  font-size: 14px;
  font-weight: 500;
  line-height: 200%;
  text-align: center;
  width: 100px;
  margin: 0 auto;
  padding: 4px 12px;
  border-radius: 40px;
  z-index: ${Z_INDEX.coverHeader};
  transition: all 0.3s ease-in;
  visibility: ${({ shouldShowMessage }) =>
    shouldShowMessage ? 'visible' : 'hidden'};
  opacity: ${({ shouldShowMessage }) => (shouldShowMessage ? 1 : 0)};
`

export default function useClipboard() {
  const allowToWrite = useRef(true)
  const [shouldShowMessage, setShouldShowMessage] = useState(false)

  const write = (url: string) => {
    if (allowToWrite.current === false) return

    if (window.navigator.clipboard) {
      allowToWrite.current = false

      /**
       * Since `window.navigator.clipboard` is only available in https protocol,
       * we add optional chaining to hide error when developing in http protocol, such as `http://localhost:3000`
       * Must to know that this is a work-around solution, not solved problem of unable copy in http protocol.
       */
      window.navigator.clipboard?.writeText(url)

      setShouldShowMessage(true)
      const timeout = setTimeout(() => {
        setShouldShowMessage(false)
        allowToWrite.current = true
        clearTimeout(timeout)
      }, 3000)
    }
  }

  const getPopup = (text = '已複製連結') => {
    return <Popup shouldShowMessage={shouldShowMessage}>{text}</Popup>
  }

  return {
    write,
    shouldShowMessage,
    setShouldShowMessage,
    getPopup,
  }
}
