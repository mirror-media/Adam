import { useCallback, useState } from 'react'
import SvgCloseIcon from '../../../public/images-next/close-black.svg'
import styled from 'styled-components'
import GPTAd from './gpt-ad'
import { Z_INDEX } from '../../../constants/index'

const FloatingAdContainer = styled.div`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    z-index: ${Z_INDEX.top};
    display: block;
    position: fixed;
    top: 175px;
    right: 15px;
  }

  .close-button {
    position: absolute;
    top: -12.5px;
    right: -12.5px;
    width: 25px;
    height: auto;
    cursor: pointer;
    user-select: none;
  }
`

/**
 * @typedef {function(googletag.events.SlotRequestedEvent):void} GoogleTagEventHandler
 *
 * @param {Object} props
 * @param {string} [props.pageKey]
 * @returns
 */
export default function GPTFloatingAd({ pageKey }) {
  const [shouldShowAdPcFloating, setShouldShowAdPcFloating] = useState(true)
  const [showBtn, setShowBtn] = useState(false)

  const handleRenderEndedAdPcFloating = useCallback((event) => {
    const isEmpty = event?.isEmpty
    if (isEmpty) {
      setShouldShowAdPcFloating(false)
    } else {
      setShowBtn(true)
    }
  }, [])

  return (
    <FloatingAdContainer>
      {shouldShowAdPcFloating && (
        <GPTAd
          pageKey={pageKey}
          adKey="PC_FLOATING"
          onSlotRenderEnded={handleRenderEndedAdPcFloating}
        />
      )}
      {showBtn && (
        <button
          className="close-button"
          onClick={() => setShouldShowAdPcFloating(false)}
        >
          <SvgCloseIcon />
        </button>
      )}
    </FloatingAdContainer>
  )
}
