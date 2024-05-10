import styled, { css } from 'styled-components'
import { InputState } from '../../constants/form'

/** @typedef {import("../../constants/form").InputStateEnum} InputStateEnum */

/**
 * @typedef {Object} HintProps
 * @property {React.ReactNode} children
 * @property {InputStateEnum} $state
 */

/** @param {InputStateEnum} state */
const getTextColorByState = (state) => {
  switch (state) {
    case InputState.Start:
    case InputState.Incomplete:
      return css`
        color: rgba(0, 0, 0, 0.5);
      `
    case InputState.Invalid:
      return css`
        color: #e51731;
      `
    case InputState.Valid:
      return css`
        color: #009045;
      `
  }
}

/** @type {import('styled-components').StyledComponent<"p", any, HintProps, never>} */
const Hint = styled.p`
  display: flex;
  align-items: center;
  column-gap: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;

  ${
    /** @param {HintProps} props */
    ({ $state }) => getTextColorByState($state)
  }
`

export default Hint
