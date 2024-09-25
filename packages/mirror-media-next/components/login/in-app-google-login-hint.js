import styled from 'styled-components'
import DefaultButton from '../shared/buttons/default-button'
import FormWrapper from './form-wrapper'
import { detectMobileOs } from '../../utils/login'
import { useEffect, useState } from 'react'

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

  > a {
    color: rgba(97, 184, 198, 1);
    text-decoration: underline;
  }
`

export default function InAppGoogleLoginHint() {
  const [appLink, setAppLink] = useState('')
  const goHome = () => {
    location.href = '/'
  }

  useEffect(() => {
    const mobileOS = detectMobileOs()

    if (mobileOS === 'ios') {
      setAppLink('https://itunes.apple.com/tw/app/鏡傳媒/id1186614515?mt=8')
    } else if (mobileOS === 'android') {
      setAppLink(
        'https://play.google.com/store/apps/details?id=com.mirrormedia.news'
      )
    } else {
      setAppLink('https://www.mirrormedia.mg/story/20161228corpmkt001')
    }
  }, [])

  return (
    <Main>
      <FormWrapper>
        <Hint>
          由於第三方App中不允許使用 Google
          登入，請複製網址至瀏覽器繼續登入，或至
          <a href={appLink} target="_blank" rel="noreferrer">
            我們的App
          </a>
          進行瀏覽。
        </Hint>
        <DefaultButton onClick={goHome}>關閉</DefaultButton>
      </FormWrapper>
    </Main>
  )
}
