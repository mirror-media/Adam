import { useEffect, useState } from 'react'

import { getAdSlotParam, getAdWidth } from '../../../utils/gpt-ad.js'
import styled from 'styled-components'
import { useMembership } from '../../../context/membership'

const Wrapper = styled.div`
  /**
 * 廣告有時會替換掉原本 <Ad> 元件裡頭的根元素 <div>
 * 因此不限定所指定的元素類型（*）
 * 以確保能選擇到 Wrapper 的直接子元素
 */
  & > * {
    display: block;
    margin-left: auto;
    margin-right: auto;
    iframe {
      display: block;
    }
  }
`

const Ad = styled.div`
  max-width: 100%;
  text-align: center;

  /* don't use 'align-items: center;' to prevent gpt layout issue */
  iframe {
    margin-left: auto;
    margin-right: auto;
  }

  width: ${
    /**
     * @param {Object} props
     * @param {string} props.width
     * @returns
     */
    ({ width }) => width || 'unset'
  };
`

/**
 * @typedef {function(googletag.events.SlotRequestedEvent):void} GoogleTagEventHandler
 *
 * @param {Object} props
 * @param {string} props.pageKey - key to access GPT_UNITS first layer
 * @param {string} props.adKey - key to access GPT_UNITS second layer, might need to complete with device
 * @param {GoogleTagEventHandler} [props.onSlotRequested] - callback when slotRequested event occurs
 * @param {GoogleTagEventHandler} [props.onSlotRenderEnded] - callback when slotRenderEnded event occurs
 * @param {string} [props.className] - for styled-component method to add styles
 * @returns
 */
export default function GPTAd({
  pageKey,
  adKey,
  onSlotRequested,
  onSlotRenderEnded,
  className,
}) {
  const { memberInfo, isLogInProcessFinished } = useMembership()
  const { memberType } = memberInfo

  const [adWidth, setAdWidth] = useState('')
  const [adDivId, setAdDivId] = useState('')
  const [gptAdJsx, setGptAdJsx] = useState(null)

  useEffect(() => {
    if (!(pageKey && adKey)) {
      console.error(
        `GPTAd not receive necessary pageKey ${pageKey} or ${adKey}`
      )
      return
    }
    const width = window.innerWidth
    const adSlotParam = getAdSlotParam(pageKey, adKey, width)
    if (!adSlotParam) {
      return
    }
    const { adUnitPath, adSize } = adSlotParam
    const adDivId = adUnitPath
    const adWidth = getAdWidth(adSize)
    setAdWidth(adWidth)
    setAdDivId(adDivId)

    /**
     * Check https://developers.google.com/publisher-tag/guides/get-started?hl=en for the tutorial of the flow.
     */
    let adSlot
    window.googletag.cmd.push(() => {
      adSlot = window.googletag
        .defineSlot(adUnitPath, adSize, adDivId)
        .addService(window.googletag.pubads())
    })

    window.googletag.cmd.push(() => {
      window.googletag.display(adDivId)
    })

    // all events, check https://developers.google.com/publisher-tag/reference?hl=en#googletag.events.eventtypemap for all events
    window.googletag.cmd.push(() => {
      const pubads = window.googletag.pubads()
      if (onSlotRequested) {
        pubads.addEventListener('slotRequested', onSlotRequested)
      }
      if (onSlotRenderEnded) {
        pubads.addEventListener('slotRenderEnded', onSlotRenderEnded)
      }
    })

    return () => {
      window.googletag.cmd.push(() => {
        window.googletag.destroySlots([adSlot])
      })
    }
  }, [adKey, pageKey, onSlotRequested, onSlotRenderEnded])

  //When the user's member type is 'not-member', 'one-time-member', or 'basic-member', the AD should be displayed.

  // Since the member type needs to be determined on the client-side, the rendering of `gptAdJsx` should be done on the client-side.

  useEffect(() => {
    const invalidMemberType = ['not-member', 'one-time-member', 'basic-member']

    if (isLogInProcessFinished) {
      if (invalidMemberType.includes(memberType)) {
        setGptAdJsx(
          <Wrapper className={`${className} gpt-ad`}>
            <Ad width={adWidth} id={adDivId} />
          </Wrapper>
        )
      } else {
        return
      }
    }
  }, [adDivId, adWidth, className, isLogInProcessFinished, memberType])

  return <>{gptAdJsx}</>
}
