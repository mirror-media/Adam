import { useState, useEffect, useCallback, useRef } from 'react'

import FullScreenAd from './ad-item'
import GPTAd from '../gpt/gpt-ad'
import { useDisplayAd } from '../../../hooks/useDisplayAd'

/**
 * @typedef {'default' | 'bottom' | 'modified'| 'unset'} FullScreenAdStyle
 */

/**
 * 蓋板廣告有四層，分別為：第一層 FS、第二層BT、第三層 AD2、第四層 Innity
 *
 * 第一層 FS（AdFirst）：
 * 帶有自定義的樣式和關閉按鈕，關閉按鈕在發送廣告請求後，延遲 3 秒才顯示
 * 因為帶有自定義的透明灰底樣式，所以在廣告載入結束後才顯示（透過`setFullScreenAdStyle('default')`實作）
 * 若沒有 FS 則顯示下一層 FS 廣告
 *
 * 第二層 BT（AdSecond）：
 * 帶有自定義的樣式和關閉按鈕，關閉按鈕在發送廣告請求後，延遲 3 秒才顯示
 * 若沒有 BT 則顯示下一層 AD2 廣告
 *
 * 第三層 AD2（AdThird）:
 * AD2 為不額外帶有樣式的廣告，但因為 GPT Lazy loading 需要知道何時載入的位置
 * 因此需要設置修正用樣式（`setFullScreenAdStyle('modified')`），來觸發廣告載入
 * 當廣告載入完成後，就將該樣式移除 (`setFullScreenAdStyle('unset')`)
 *
 * 而 AD2 無法透過 GPT 的事件來確認是否有廣告，跟廠商協調後
 * 當 AD2 沒廣告時，由廠商傳遞 noad2 事件，由我們監聽來顯示下一層 Innity 廣告
 *
 * 第四層 Innity（AdFourth）:
 * 同 AD2 一樣為不額外帶有樣式的廣告，因此需要先設置修正用樣式
 */

/**
 *
 * @param {Object} props
 * @param {boolean} [props.hiddenAdvertised] - CMS Posts「google廣告違規」
 * @returns {JSX.Element}
 */
export default function FullScreenAdsContainer({ hiddenAdvertised = false }) {
  const [displayedAd, setDisplayedAd] = useState('first')
  const hasAdFirst = displayedAd === 'first'
  const hasAdSecond = displayedAd === 'second'
  const hasAdThird = displayedAd === 'third'
  const hasAdFourth = displayedAd === 'fourth'

  const hasAdThirdOrFourth = hasAdThird || hasAdFourth
  const shouldShowAd = useDisplayAd(hiddenAdvertised)
  /** @type {[FullScreenAdStyle,import('react').Dispatch<FullScreenAdStyle>]} */
  const [fullScreenAdStyle, setFullScreenAdStyle] = useState(
    /** @type {FullScreenAdStyle} */
    ('unset')
  )
  const [isAdFirstClosedBtnVisible, setIsAdFirstClosedBtnVisible] =
    useState(false)
  const timerForClosedBtn = useRef(null)
  const setTimerForClosedBtn = useCallback(() => {
    timerForClosedBtn.current = setTimeout(() => {
      setIsAdFirstClosedBtnVisible(true)
    }, 3000)
  }, [])
  const clearTimerForClosedBtn = useCallback(() => {
    clearTimeout(timerForClosedBtn.current)
  }, [])

  /**
   * 監聽 noad2 事件，如果觸發該事件，代表並沒有第三層(MB_AD2)廣告沒有內容。
   * 如果沒有內容，則設定目前應顯示的廣告為fourth，並且設置樣式為modified。
   * 設置後將會顯示第四層廣告(MB_INNITY)的GPT廣告元件
   */
  useEffect(() => {
    if (hasAdThird) {
      const handleNoAD2 = () => {
        setDisplayedAd('fourth')
        setFullScreenAdStyle('modified')
      }
      window.addEventListener('noad2', handleNoAD2)
      return () => window.removeEventListener('noad2', handleNoAD2)
    }
  }, [hasAdThird])

  /**
   * 用於偵測第一層廣告(MB_FS)是否有內容。
   * 如果有內容的話，則設定目前顯示的廣告為first，並且設置樣式為default。
   * 如果沒有內容的話，則設定目前應顯示的廣告為second，並且設置樣式為bottom，設置後將會顯示第二層廣告(MB_BT)的GPT廣告元件。
   */
  const handleOnSlotRenderEndedFirst = useCallback(
    (event) => {
      const hasAd = !event.isEmpty
      if (hasAd) {
        setDisplayedAd('first')
        setFullScreenAdStyle('default')
      } else {
        clearTimerForClosedBtn()
        setDisplayedAd('second')
        setFullScreenAdStyle('bottom')
      }
    },
    [clearTimerForClosedBtn]
  )
  /**
   * 用於偵測第二層廣告(MB_BT)是否有內容。
   * 如果有內容的話，則設定目前顯示的廣告為second，並且設置樣式為bottom。
   * 如果沒有內容的話，則設定目前應顯示的廣告為third，並且設置樣式為modified，設置後將會顯示第三層廣告(MB_BT)的GPT廣告元件。
   */
  const handleOnSlotRenderEndedSecond = useCallback(
    (event) => {
      const hasAd = !event.isEmpty
      if (hasAd) {
        setDisplayedAd('second')
        setFullScreenAdStyle('bottom')
      } else {
        clearTimerForClosedBtn()
        setDisplayedAd('third')
        setFullScreenAdStyle('modified')
      }
    },
    [clearTimerForClosedBtn]
  )
  const disableModifiedStyle = useCallback(() => {
    setFullScreenAdStyle('unset')
  }, [])
  return (
    <>
      {shouldShowAd && (
        <>
          {hasAdFirst && (
            <FullScreenAd
              fullScreenAdStyle={fullScreenAdStyle}
              isAdFirstClosedBtnVisible={isAdFirstClosedBtnVisible}
            >
              <GPTAd
                key="ad-first"
                pageKey="global"
                adKey="MB_FS"
                onSlotRequested={setTimerForClosedBtn}
                onSlotRenderEnded={handleOnSlotRenderEndedFirst}
              />
            </FullScreenAd>
          )}
          {hasAdSecond && (
            <FullScreenAd
              fullScreenAdStyle={fullScreenAdStyle}
              isAdFirstClosedBtnVisible={isAdFirstClosedBtnVisible}
            >
              <GPTAd
                key="ad-second"
                pageKey="global"
                adKey="MB_BT"
                onSlotRequested={setTimerForClosedBtn}
                onSlotRenderEnded={handleOnSlotRenderEndedSecond}
              />
            </FullScreenAd>
          )}
          {hasAdThirdOrFourth && (
            <FullScreenAd fullScreenAdStyle={fullScreenAdStyle}>
              <>
                {hasAdThird && (
                  <GPTAd
                    key="ad-third"
                    pageKey="global"
                    adKey="MB_AD2"
                    onSlotRenderEnded={disableModifiedStyle}
                  />
                )}
                {hasAdFourth && (
                  <GPTAd
                    key="ad-fourth"
                    pageKey="global"
                    adKey="MB_INNITY"
                    onSlotRenderEnded={disableModifiedStyle}
                  />
                )}
              </>
            </FullScreenAd>
          )}
        </>
      )}
    </>
  )
}
