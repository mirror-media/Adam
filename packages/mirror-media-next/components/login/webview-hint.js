import styled from 'styled-components'
import FormWrapper from './form-wrapper'
import PrimaryButton from '../shared/buttons/primary-button'
import DefaultButton from '../shared/buttons/default-button'
import StyledLink from './styled-link'
import { detectMobileOs } from '../../utils/login'
import { useEffect, useRef, useState } from 'react'
import useClipboard from '../../hooks/use-clipboard'

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Hint = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 32px;
`

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`

const IOS_APP_LINK = 'https://itunes.apple.com/tw/app/鏡傳媒/id1186614515'
const ANDROID_APP_LINK =
  'https://play.google.com/store/apps/details?id=com.mirrormedia.news'
const APP_LINK_POST = 'https://www.mirrormedia.mg/story/20161228corpmkt001'

export default function WebviewHint() {
  const [appLink, setAppLink] = useState('')
  const fullURL = useRef('')
  const intentURL = useRef('')
  const { write, getPopup } = useClipboard()

  useEffect(() => {
    fullURL.current = window.location.href

    const mobileOS = detectMobileOs(window.navigator.userAgent)
    if (mobileOS === 'ios') {
      setAppLink(IOS_APP_LINK)

      /** @see https://christiantietze.de/posts/2023/05/safari-for-mac-url-scheme/ */
      const urlWithoutPrefix = fullURL.current.replace(
        `${window.location.protocol}//`,
        ''
      )

      intentURL.current = `x-safari-https://${urlWithoutPrefix}`
    } else if (mobileOS === 'android') {
      setAppLink(ANDROID_APP_LINK)

      /** @see https://stackoverflow.com/a/58342222 */
      intentURL.current = `intent:${fullURL.current}#Intent;end`
    } else {
      setAppLink(APP_LINK_POST)
    }
  }, [])

  const openInExternalBrowser = () => {
    window.location.href = intentURL.current
  }

  const popupJsx = getPopup('已複製網址')

  return (
    <>
      {popupJsx}
      <Main>
        <FormWrapper>
          <Hint>
            請複製網址至瀏覽器繼續登入，或至
            <StyledLink href={appLink} target="_blank" rel="noreferrer">
              我們的App
            </StyledLink>
            進行瀏覽。
          </Hint>
          <ControlGroup>
            <PrimaryButton onClick={openInExternalBrowser}>
              以外部瀏覽器開啟
            </PrimaryButton>
            <DefaultButton
              onClick={() => {
                write(fullURL.current)
              }}
            >
              複製此網址
            </DefaultButton>
          </ControlGroup>
        </FormWrapper>
      </Main>
    </>
  )
}
