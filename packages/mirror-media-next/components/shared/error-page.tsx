import { type ReactNode } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'

type ErrorPageProps = {
  // An HTTP status code, so only for server-rendered error pages. A client-side
  // error has no status: the response was already 200 by the time it happened.
  code?: ReactNode
  message: ReactNode
  showRetry?: boolean
  showGoHome?: boolean
}

const Page = styled.div`
  height: 100vh;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const MsgContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 260px;
  margin-top: 140px;
`

const H1 = styled.h1`
  font-weight: 400;
  font-size: 128px;
  line-height: 120%;
  color: #61b8c6;
`

const Text = styled.p`
  font-weight: 500;
  font-size: 24px;
  color: #61b8c6;
`

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`

const ActionButton = styled.button`
  padding: 8px 20px;
  border: 1px solid #61b8c6;
  border-radius: 38px;
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;

  &:hover {
    cursor: pointer;
    transition: 0.1s ease-in;
  }

  &:focus {
    outline: 0;
  }
`

const PrimaryAction = styled(ActionButton)`
  background-color: #61b8c6;
  color: #ffffff;

  &:hover {
    background-color: #4c9aa6;
    border-color: #4c9aa6;
  }
`

const SecondaryAction = styled(ActionButton)`
  background-color: transparent;
  color: #61b8c6;

  &:hover {
    background-color: #ffffff;
  }
`

export default function ErrorPage({
  code,
  message,
  showRetry,
  showGoHome,
}: ErrorPageProps) {
  const router = useRouter()
  // Hidden on the home page, where it would just navigate to the same broken route.
  const canGoHome = showGoHome && router.pathname !== '/'

  return (
    <Page>
      <MsgContainer>
        {code ? <H1>{code}</H1> : null}
        <Text>{message}</Text>
        {(showRetry || canGoHome) && (
          <Actions>
            {showRetry && (
              <PrimaryAction
                type="button"
                onClick={() => window.location.reload()}
              >
                重新整理
              </PrimaryAction>
            )}
            {canGoHome && (
              <SecondaryAction type="button" onClick={() => router.push('/')}>
                回首頁
              </SecondaryAction>
            )}
          </Actions>
        )}
      </MsgContainer>
    </Page>
  )
}
