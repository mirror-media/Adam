import styled, { css } from 'styled-components'

/**
 * @typedef {Object} StepProps
 * @property {boolean} isActive - Determines if the step is active or not.
 * @property {React.ReactNode} children
 */

const StepsWrapper = styled.ol`
  display: flex;
  justify-content: center;
`
/**
 * Step component displays a single step in a set of steps.
 * @param {StepProps} props
 * @returns {JSX.Element}
 */
const Step = styled.li`
  line-height: 150%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  position: relative;

  &:not(:last-child) {
    margin-right: 46px;

    ${({ theme }) => theme.breakpoint.md} {
      margin-right: 100px;
    }
  }

  &:not(:first-child)::before {
    content: '';
    display: block;
    width: 14px;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateX(-30px);

    ${({ theme }) => theme.breakpoint.md} {
      width: 60px;
      transform: translateX(-80px);
    }
  }

  ${({ theme }) => theme.breakpoint.md} {
    padding: 24px 0;
  }

  ${
    /**
     * @param {{isActive: boolean}} param
     */
    ({ isActive }) =>
      isActive &&
      css`
        ${Text} {
          color: #054f77;
        }

        ${Number} {
          background-color: #054f77;
          color: #fff;
        }

        &:not(:first-child)::before {
          background-color: #054f77;
        }
      `
  }
`

const Number = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
  margin-right: 8px;
  color: rgba(0, 0, 0, 0.3);
  width: 32px;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;

  ${({ theme }) => theme.breakpoint.md} {
    margin-right: 12px;
  }
`
const Text = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.3);
  width: 28px;

  ${({ theme }) => theme.breakpoint.md} {
    font-size: 18px;
    font-weight: 500;
    width: auto;
  }
`

/**
 * Steps component displays a set of steps with the active step highlighted.
 * @param {Object} props
 * @param {number} props.activeStep - The index of the active step (1-based).
 *                                  // ^-- Hint: Should be a number between 1 and 3.
 * @returns {React.ReactNode}
 */
function Steps({ activeStep = 1 }) {
  return (
    <StepsWrapper>
      <Step isActive={activeStep >= 1}>
        <Number>1</Number>
        <Text>方案選擇</Text>
      </Step>
      <Step isActive={activeStep >= 2}>
        <Number>2</Number>
        <Text>確認訂購</Text>
      </Step>
      <Step isActive={activeStep >= 3}>
        <Number>3</Number>
        <Text>訂單完成</Text>
      </Step>
    </StepsWrapper>
  )
}

export default Steps
