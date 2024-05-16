import styled from 'styled-components'
import Hint from '../shared/hint'
import CenteredHint from '../shared/centered-hint'
import { InputState } from '../../constants/form'

const DEFAULT = 'default'
const NOT_REGISRATED = 'not-registrated'
const ERROR = 'error'
const IN_PROGRESS = 'in-progress'
const SUCCESS = 'success'

const StyledHint = styled(Hint)`
  font-size: 16px;
  text-align: center;
  align-self: center;
`

export const HINT_STATE = /** @type {const} */ ({
  DEFAULT,
  NOT_REGISRATED,
  ERROR,
  IN_PROGRESS,
  SUCCESS,
})

/**
 * @param {Object} props
 * @param {DEFAULT | NOT_REGISRATED | ERROR | IN_PROGRESS | SUCCESS} props.state
 */
export default function Hints({ state }) {
  switch (state) {
    case IN_PROGRESS:
      return (
        <StyledHint $state={InputState.Incomplete}>正在寄出信件...</StyledHint>
      )
    case NOT_REGISRATED:
      return (
        <StyledHint $state={InputState.Invalid}>這個 Email 尚未註冊</StyledHint>
      )
    case ERROR:
      return (
        <StyledHint $state={InputState.Invalid}>
          Email 寄出失敗，請重新再試
        </StyledHint>
      )
    case SUCCESS:
      return (
        <>
          <StyledHint $state={InputState.Valid}>Email 已成功寄出</StyledHint>
          <CenteredHint $state={InputState.Incomplete}>
            沒收到信嗎？請檢查垃圾信件匣，或等候 30 秒重新寄送
          </CenteredHint>
        </>
      )
    default:
      return
  }
}
