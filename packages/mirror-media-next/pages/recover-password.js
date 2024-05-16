import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { setPageCache } from '../utils/cache-setting'
import { GCP_PROJECT_ID, ACTION_CODE_SETTING } from '../config/index.mjs'
import { InputState } from '../constants/form'
import LayoutFull from '../components/shared/layout-full'
import FormWrapper from '../components/shared/form-wrapper'
import GenericTextInput from '../components/shared/inputs/generic-text-input'
import PrimaryButton from '../components/shared/buttons/primary-button'
import TextButton from '../components/login/text-button'
import { isValidEmail } from '../utils'
import redirectToDestinationWhileAuthed from '../utils/redirect-to-destination-while-authed'
import { auth } from '../firebase'
import { FirebaseError } from 'firebase/app'
import { sendPasswordResetEmail } from 'firebase/auth'
import { generateErrorReportInfo } from '../utils/log/error-log'
import { sendErrorLog } from '../utils/log/send-log'
import { SECOND } from '../constants/time-unit'
import Hints, { HINT_STATE } from '../components/recover-password/hints'
import { FirebaseAuthError } from '../constants/firebase'

// following comments is required since these variables are used by comments but not codes.
/* eslint-disable-next-line no-unused-vars */
const { DEFAULT, NOT_REGISRATED, ERROR, IN_PROGRESS, SUCCESS } = HINT_STATE

/** @typedef {DEFAULT | NOT_REGISRATED | ERROR | IN_PROGRESS | SUCCESS} HintState */

/**
 * @typedef {Object} PageProps
 * @property {string} emailData
 */

const Container = styled.div`
  flex-grow: 1;

  background-color: #fff;
  ${({ theme }) => theme.breakpoint.md} {
    background-color: #f2f2f2;
  }
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
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
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  margin-top: 32px;
`

const PrimaryButtonAndHint = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
`

/**
 * @param {PageProps} props
 */
export default function Login({ emailData }) {
  const COOLDOWN_STORAGE_KEY = 'recover-password-cooldown'
  const AVOID_SPAM_COOLDOWN = SECOND * 30

  const getValidality = (/** @type {string} */ email) => {
    if (email === '') {
      return InputState.Start
    } else {
      if (isValidEmail(email)) {
        return InputState.Valid
      } else {
        return InputState.Invalid
      }
    }
  }

  const [email, setEmail] = useState(emailData)
  const [inputState, setInputState] = useState(getValidality(email))
  const [avoidSpamCooldown, setAvoidSpanCooldown] = useState(0)
  const [hintState, setHintState] = useState(
    /** @type {HintState} */ (HINT_STATE.DEFAULT)
  )

  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  const handleInputChange = (e) => {
    const inputValue = e.target.value

    setEmail(inputValue)
    setInputState(getValidality(inputValue))
  }

  /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
  const handleSubmit = async () => {
    if (
      hintState === HINT_STATE.IN_PROGRESS ||
      inputState !== InputState.Valid
    ) {
      return
    }

    setHintState(HINT_STATE.IN_PROGRESS)

    try {
      await sendPasswordResetEmail(auth, email, {
        ...ACTION_CODE_SETTING,
        url: `${window.location.origin}/login`,
      })

      setHintState(HINT_STATE.SUCCESS)
      setAvoidSpanCooldown(AVOID_SPAM_COOLDOWN)
      /** @type {number} */
      const coolDownExpiredTime = Date.now() + AVOID_SPAM_COOLDOWN
      localStorage.setItem(COOLDOWN_STORAGE_KEY, coolDownExpiredTime.toString())
    } catch (e) {
      if (
        e instanceof FirebaseError &&
        e.code === FirebaseAuthError.USER_NOT_FOUND
      ) {
        setHintState(HINT_STATE.NOT_REGISRATED)
      } else {
        setHintState(HINT_STATE.ERROR)
      }

      const info = generateErrorReportInfo(e, { userEmail: email })
      sendErrorLog(info)
    }
  }

  // load cooldown info while page loaded
  useEffect(() => {
    /** @type {number} */
    const coolDownExpiredTime = Number(
      localStorage.getItem(COOLDOWN_STORAGE_KEY)
    )
    const now = Date.now()

    if (Number.isNaN(coolDownExpiredTime)) return

    if (coolDownExpiredTime > now) {
      const cooldown = coolDownExpiredTime - now
      setAvoidSpanCooldown(cooldown)
      setHintState(HINT_STATE.SUCCESS)
    } else {
      localStorage.removeItem(COOLDOWN_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (avoidSpamCooldown > 0)
        setAvoidSpanCooldown((state) => state - SECOND * 1)
      else {
        setHintState(HINT_STATE.DEFAULT)
        clearInterval(timer)
        localStorage.removeItem(COOLDOWN_STORAGE_KEY)
      }
    }, SECOND * 1)

    return () => {
      clearInterval(timer)
    }
  }, [avoidSpamCooldown])

  return (
    <LayoutFull header={{ type: 'default' }} footer={{ type: 'default' }}>
      <Container>
        <Main>
          <FormWrapper>
            <TextGroup>
              <PrimayText>如果您忘記/尚未設定密碼</PrimayText>
              <SecondaryText>
                請輸入您註冊時使用的 Email 信箱。我們會發送一封 Email
                到這個地址，裡面附有重設/設定密碼的連結。
              </SecondaryText>
            </TextGroup>
            <ControlGroup>
              <GenericTextInput
                placeholder="name@example.com"
                value={email}
                state={inputState}
                onChange={handleInputChange}
              />
              <PrimaryButtonAndHint>
                <Hints state={hintState} />
                {avoidSpamCooldown > 0 ? (
                  <PrimaryButton disabled={true} onClick={() => {}}>
                    重新寄送...({Math.floor(avoidSpamCooldown / SECOND)} 秒)
                  </PrimaryButton>
                ) : (
                  <PrimaryButton
                    onClick={handleSubmit}
                    isLoading={hintState === HINT_STATE.IN_PROGRESS}
                    disabled={inputState !== InputState.Valid}
                  >
                    送出
                  </PrimaryButton>
                )}
              </PrimaryButtonAndHint>
              <TextButton href="/login">回上一頁</TextButton>
            </ControlGroup>
          </FormWrapper>
        </Main>
      </Container>
    </LayoutFull>
  )
}

/**
 * @type {import('next').GetServerSideProps<PageProps>}
 */
export const getServerSideProps = redirectToDestinationWhileAuthed()(
  async ({ req, res, query }) => {
    setPageCache(res, { cachePolicy: 'no-store' }, req.url)
    const traceHeader = req.headers?.['x-cloud-trace-context']
    let globalLogFields = {}
    if (traceHeader && !Array.isArray(traceHeader)) {
      const [trace] = traceHeader.split('/')
      globalLogFields[
        'logging.googleapis.com/trace'
      ] = `projects/${GCP_PROJECT_ID}/traces/${trace}`
    }

    const { email } = query
    const emailData = Array.isArray(email) ? email.join(',') : email ?? ''

    return { props: { emailData } }
  }
)
