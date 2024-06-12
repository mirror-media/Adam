import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { auth } from '../../firebase'
import { generateErrorReportInfo } from '../../utils/log/error-log'
import { sendErrorLog } from '../../utils/log/send-log'
import { getSearchParamFromApiKeyUrl, isValidPassword } from '../../utils'
import { InputState } from '../../constants/form'
import FormWrapper from '../login/form-wrapper'
import GenericPasswordInput from '../shared/inputs/generic-password-input'
import PrimaryButton from '../shared/buttons/primary-button'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin-bottom: 24px;
`

const PrimaryText = styled.p`
  color: rgba(0, 0, 0, 0.87);
  font-size: 24px;
  font-weight: 500;
  line-height: 150%;
`

export default function BodyPasswordReset() {
  const [password, setPassword] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  const actionCode = getSearchParamFromApiKeyUrl(router.query, 'oobCode')
  const email = useRef('')

  const getValidality = (/** @type {string} */ password) => {
    if (password === '') {
      return InputState.Start
    } else {
      if (isValidPassword(password)) {
        return InputState.Valid
      } else {
        return InputState.Invalid
      }
    }
  }

  const validality = getValidality(password)

  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  const handleOnInputChange = (e) => {
    setPassword(e.target.value)
  }

  const handleOnPrimaryButtonClicked = async () => {
    if (isProcessing) return

    setIsProcessing(true)

    try {
      if (Array.isArray(actionCode)) throw new Error('Invalid action code')

      await confirmPasswordReset(auth, actionCode, password)

      router.replace('/password-change-success')
    } catch (err) {
      const errorReport = generateErrorReportInfo(err, {
        userEmail: email.current,
      })
      sendErrorLog(errorReport)

      router.replace({
        pathname: '/password-change-fail',
        query: {
          from: router.pathname,
        },
      })
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (isInitialized) return

    const checkUrlInfo = async () => {
      try {
        if (Array.isArray(actionCode)) throw new Error('Invalid action code')

        email.current = await verifyPasswordResetCode(auth, actionCode)

        setIsInitialized(true)
      } catch (err) {
        const errorReport = generateErrorReportInfo(err, {
          userEmail: email.current,
        })
        sendErrorLog(errorReport)

        router.replace({
          pathname: '/password-change-fail',
          query: {
            from: router.pathname,
          },
        })
      }
    }

    checkUrlInfo()
  }, [actionCode, isInitialized, router])

  return (
    <Main>
      <FormWrapper>
        {isInitialized ? (
          <>
            <ContentBlock>
              <PrimaryText>請輸入新的密碼</PrimaryText>
              <GenericPasswordInput
                placeholder="密碼大於 6 位數"
                state={validality}
                value={password}
                onChange={handleOnInputChange}
              />
            </ContentBlock>
            <PrimaryButton
              onClick={handleOnPrimaryButtonClicked}
              isLoading={isProcessing}
              disabled={validality !== InputState.Valid}
            >
              送出
            </PrimaryButton>
          </>
        ) : null}
        {/* TODO: add loading effect (should discuss with designer and PM) */}
      </FormWrapper>
    </Main>
  )
}
