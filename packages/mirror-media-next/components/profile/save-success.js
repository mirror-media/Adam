import styled from 'styled-components'
import FormWrapper from './form-wrapper'
import { useEffect } from 'react'
import { SECOND } from '../../constants/time-unit'

const REDIRECTION_DELAY = 5

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
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin-top: 16px;
`

/**
 * @param {Object} props
 * @param {() => void} props.onReset
 * @returns {JSX.Element}
 */
export default function SaveSuccess({ onReset }) {
  useEffect(() => {
    const task = setTimeout(() => onReset(), SECOND * REDIRECTION_DELAY)

    return () => {
      clearTimeout(task)
    }
  }, [onReset])

  return (
    <Main>
      <FormWrapper>
        <PrimayText>儲存成功</PrimayText>
        <SecondaryText>
          將於 {REDIRECTION_DELAY} 秒後導回個人資料頁...
        </SecondaryText>
      </FormWrapper>
    </Main>
  )
}
