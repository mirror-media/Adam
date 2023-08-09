import styled from 'styled-components'
import { Z_INDEX } from '../../../constants'
import NextLink from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useAmp } from 'next/amp'

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: ${Z_INDEX.top};
`

const WarningContent = styled.div`
  width: 90%;
  max-width: 500px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 10px;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 30px;
  }

  p {
    color: #333;
    font-size: 16px;
    text-align: justify;
    line-height: 1.5;
    margin: 25px 0;
  }
`

const WarningTitle = styled.h2`
  padding: 0 0 20px;
  color: #34495e;
  font-size: 26px;
  line-height: 1.5;
  text-align: center;
  border-bottom: 1px solid #d9d9d9;
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0 16px;

  ${({ theme }) => theme.breakpoint.md} {
    justify-content: flex-end;
  }

  button {
    display: inline-block;
    font-size: 14px;
    padding: 10px 18px;
    background: #ffffff;
    border: 1px solid #c1c2c5;
    border-radius: 5px;
  }

  .agree-button {
    color: #fff;
    background: #1087a8;
    border: none;

    &:hover {
      background: #0e7ea0;
    }
  }
`

/**
 *
 * @param {Object} props
 * @param {boolean} props.isAdult
 * @returns {JSX.Element}
 */

export default function AdultOnlyWarning({ isAdult = false }) {
  const isAmp = useAmp()
  const [isAgreed, setIsAgreed] = useState(false)

  const shouldShowAdultWarning = Boolean(isAdult && !isAgreed)

  const warningRef = useRef(null)

  // While adult-warning show (`shouldShowAdultWarning` = true), disable body scroll.
  useEffect(() => {
    const adultWarning = warningRef.current

    if (!adultWarning) {
      return
    }

    if (shouldShowAdultWarning) {
      disableBodyScroll(adultWarning)
      return () => enableBodyScroll(adultWarning)
    } else {
      return undefined
    }
  }, [shouldShowAdultWarning])

  let agreeBtnJsx
  if (isAmp) {
    agreeBtnJsx = (
      <button
        className="agree-button"
        on="tap:adult-only-warning.hide,amp-page.toggleClass(class='disable-scroll')"
        aria-label="是，我已年滿十八歲"
      >
        是，我已年滿十八歲
      </button>
    )
  } else {
    agreeBtnJsx = (
      <button
        className="agree-button"
        onClick={() => {
          setIsAgreed(true)
        }}
        aria-label="是，我已年滿十八歲"
      >
        是，我已年滿十八歲
      </button>
    )
  }

  const adultOnlyJsx = shouldShowAdultWarning ? (
    <Wrapper ref={warningRef} id="adult-only-warning">
      <WarningContent>
        <WarningTitle>
          您即將進入之內容
          <br />
          需滿十八歲方可瀏覽
        </WarningTitle>

        <p>
          根據「電腦網路內容分級處理辦法」第六條第三款規定，本網站已於各限制級網頁依照台灣網站分級推廣基金會之規定標示。若您尚未年滿十八歲，請點選離開。若您已滿十八歲，亦不可將本區之內容派發、傳閱、出售、出租、交給或借予年齡未滿18歲的人士瀏覽，或將本網站內容向該人士出示、播放或放映。
        </p>

        <ButtonWrapper>
          {agreeBtnJsx}
          <NextLink href="/" aria-label="離開">
            <button>離開</button>
          </NextLink>
        </ButtonWrapper>
      </WarningContent>
    </Wrapper>
  ) : null

  return <>{adultOnlyJsx}</>
}
