import { useState, useEffect, useMemo } from 'react'
import useFirstScrollDetector from '../../../hooks/useFirstScrollDetector.js'

import {
  getAdSlotParam,
  getAdSlotParamByAdUnit,
  getAdWidth,
} from '../../../utils/gpt-ad.js'
import styled from 'styled-components'

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
  ${
    /**
     * @param {Object} props
     * @param {boolean} props.shouldHideComponent
     * @returns
     */
    ({ shouldHideComponent }) => {
      return shouldHideComponent && 'display: none !important;'
    }
  };
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
 * @param {string} [props.pageKey] - key to access GPT_UNITS first layer
 * @param {string} [props.adKey] - key to access GPT_UNITS second layer, might need to complete with device
 * @param {string} [props.adUnit]
 * @param {GoogleTagEventHandler} [props.onSlotRequested] - callback when slotRequested event occurs
 * @param {GoogleTagEventHandler} [props.onSlotRenderEnded] - callback when slotRenderEnded event occurs
 * @param {string} [props.className] - for styled-component method to add styles
 * @returns
 */
export default function GPTAd({
  pageKey,
  adKey,
  adUnit,
  onSlotRequested,
  onSlotRenderEnded,
  className,
}) {
  const [adSize, setAdSize] = useState([])
  const [adUnitPath, setAdUnitPath] = useState('')
  const [adWidth, setAdWidth] = useState('')

  const hasScrolled = useFirstScrollDetector()
  const shouldHideAtFirst = adKey === 'MB_ST'
  const adDivId = adUnitPath // Set the id of the ad `<div>` to be the same as the `adUnitPath`.

  const shouldHideComponent = useMemo(() => {
    return shouldHideAtFirst && !hasScrolled
  }, [shouldHideAtFirst, hasScrolled])

  useEffect(() => {
    let newAdSize, newAdUnitPath, newAdWidth
    if (pageKey && adKey) {
      // built-in ad unit
      const width = window.innerWidth
      const adSlotParam = getAdSlotParam(pageKey, adKey, width)
      if (!adSlotParam) {
        return
      }
      const { adUnitPath, adSize } = adSlotParam
      newAdSize = adSize
      newAdUnitPath = adUnitPath
      newAdWidth = getAdWidth(adSize)
    } else if (adUnit) {
      // custom ad unit string
      const adSlotParam = getAdSlotParamByAdUnit(adUnit)
      const { adUnitPath, adSize } = adSlotParam

      newAdSize = adSize
      newAdUnitPath = adUnitPath
      newAdWidth = getAdWidth(adSize)
    } else {
      console.error(
        `GPTAd not receive necessary pageKey '${pageKey}' and adKey '${adKey}' or adUnit '${adUnit}'`
      )
      return
    }

    setAdSize(newAdSize)
    setAdWidth(newAdWidth)
    setAdUnitPath(newAdUnitPath)
  }, [adKey, pageKey, adUnit])

  useEffect(() => {
    if (adDivId && adWidth && window.googletag) {
      /**
       * Check https://developers.google.com/publisher-tag/guides/get-started?hl=en for the tutorial of the flow.
       */
      let adSlot

      const handleOnSlotRequested = (event) => {
        if (event.slot === adSlot) {
          onSlotRequested(event)
        }
      }
      const handleOnSlotRenderEnded = (event) => {
        if (event.slot === adSlot) {
          onSlotRenderEnded(event)
        }
      }
      window.googletag.cmd.push(() => {
        const pubads = window.googletag.pubads()

        adSlot = window.googletag
          .defineSlot(adUnitPath, adSize, adDivId)
          .addService(window.googletag.pubads())
        window.googletag.display(adDivId)

        // all events, check https://developers.google.com/publisher-tag/reference?hl=en#googletag.events.eventtypemap for all events
        if (onSlotRequested) {
          /**
           * add event listener  to respond only to certain adSlot
           * @see https://developers.google.com/publisher-tag/reference?hl=zh-tw#googletag.Service_addEventListener
           */
          pubads.addEventListener('slotRequested', handleOnSlotRequested)
        }
        if (onSlotRenderEnded) {
          pubads.addEventListener('slotRenderEnded', handleOnSlotRenderEnded)
        }
      })

      return () => {
        const pubads = window.googletag.pubads()

        window.googletag.cmd.push(() => {
          window.googletag.destroySlots([adSlot])
          if (onSlotRenderEnded) {
            pubads.removeEventListener('slotRequested', handleOnSlotRequested)
          }
          if (onSlotRenderEnded) {
            pubads.removeEventListener(
              'slotRenderEnded',
              handleOnSlotRenderEnded
            )
          }
        })
      }
    }
  }, [adDivId, adSize, adUnitPath, adWidth, onSlotRenderEnded, onSlotRequested])

  return (
    <Wrapper
      className={`${className} gpt-ad`}
      shouldHideComponent={shouldHideComponent}
    >
      <Ad width={adWidth} id={adDivId} />
    </Wrapper>
  )
}
