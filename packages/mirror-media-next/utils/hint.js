import { InputState } from '../constants/form'
import Hint from '../components/shared/hint'
import IconCheckPass from '../public/images-next/check-pass.svg'

/**
 * @param {import("../constants/form").InputStateEnum} state
 * @param {Object} messages
 * @param {string} [messages.incompleteMessage]
 * @param {string} [messages.invalidMessage]
 * @param {string} [messages.validMessage]
 */
export default function getHint(
  state,
  { incompleteMessage, invalidMessage, validMessage }
) {
  switch (state) {
    case InputState.Invalid:
      if (invalidMessage) {
        return <Hint $state={InputState.Invalid}>{invalidMessage}</Hint>
      }
      return
    case InputState.Valid:
      if (validMessage) {
        return (
          <Hint $state={InputState.Valid}>
            <IconCheckPass />
            <span>{validMessage}</span>
          </Hint>
        )
      }
      return
    case InputState.Incomplete:
      if (incompleteMessage) {
        return <Hint $state={InputState.Incomplete}>{incompleteMessage}</Hint>
      }
      return
    case InputState.Start:
      return
  }
}
