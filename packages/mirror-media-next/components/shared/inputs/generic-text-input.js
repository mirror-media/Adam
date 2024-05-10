import styled, { css } from 'styled-components'
import { InputState } from '../../../constants/form'
import getHint from '../../../utils/hint'

/** @typedef {import('../../../constants/form').InputStateEnum} TextInputState */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
`
/**
 * @typedef {Object} InputProps
 * @property {boolean} $isInvalid
 */

/** @type {import('styled-components').StyledComponent<"input", any, InputProps, never>} */
const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 12px;
  overflow-x: scroll;
  background: #fff;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  font-size: 18px;
  font-weight: 400;
  line-height: 150%;
  color: rgba(0, 0, 0, 0.87);
  outline: none;

  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }

  &:active,
  &:focus {
    border: 1px solid rgba(0, 0, 0, 0.87);
  }

  ${
    /** @param {InputProps} props */
    ({ $isInvalid }) =>
      $isInvalid &&
      css`
        border: 1px solid #e51731;
      `
  }
`

/**
 * @param {Object} props
 * @param {string} [props.value] - input 數值
 * @param {TextInputState} props.state - input 狀態
 * @param {string} props.placeholder - placeholder 數值
 * @param {boolean} [props.isDisabled] - 是否禁止修改
 * @param {string} [props.incompleteMessage] - 輸入未完成的提示
 * @param {string} [props.invalidMessage] - 輸入錯誤的提示
 * @param {string} [props.validMessage] - 輸入正確的提示
 * @param {import("react").ChangeEventHandler<HTMLInputElement>} props.onChange - 數值變動處理
 */
export default function GenericTextInput({
  value,
  placeholder,
  state,
  isDisabled,
  incompleteMessage,
  invalidMessage,
  validMessage,
  onChange,
}) {
  return (
    <Wrapper>
      <Input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={onChange}
        $isInvalid={state === InputState.Invalid}
      />
      {getHint(state, {
        incompleteMessage,
        invalidMessage,
        validMessage,
      })}
    </Wrapper>
  )
}
