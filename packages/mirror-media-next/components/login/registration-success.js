import styled from 'styled-components'
import FormWrapper from '../shared/form-wrapper'
import useRedirect from '../../hooks/use-redirect'
import { useEffect } from 'react'
import { SECOND } from '../../constants/time-unit'

const REDIRECTION_DELAY = 3 // 秒，Nuxt 2.0 時期的設定

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const PrimayText = styled.p`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
`

const SecondaryText = styled.p`
  color: rgba(0, 0, 0, 0.3);
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin-top: 32px;
`

export default function RegistrationSuccess() {
  const { redirect } = useRedirect()

  useEffect(() => {
    const task = setTimeout(() => redirect(), SECOND * REDIRECTION_DELAY)

    return () => {
      clearTimeout(task)
    }
  }, [])

  return (
    <Main>
      <FormWrapper>
        <PrimayText>
          註冊成功！
          <br />
          歡迎加入鏡週刊
        </PrimayText>
        <SecondaryText>
          將於 {REDIRECTION_DELAY} 秒後自動跳轉至首頁...
        </SecondaryText>
      </FormWrapper>
    </Main>
  )
}
