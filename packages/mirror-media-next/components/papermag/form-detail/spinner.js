//source: https://tobiasahlin.com/spinkit/

import styled, { keyframes } from 'styled-components'

const bounceDelayAnimation = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
`

const SpinnerWrapper = styled.div`
  width: 70px;
  text-align: center;
  margin: auto;
`

const Bounce = styled.div`
  width: 14px;
  height: 14px;
  background-color: #fff;
  border-radius: 100%;
  display: inline-block;
  animation: ${bounceDelayAnimation} 1.4s infinite ease-in-out both;
`

const Bounce1 = styled(Bounce)`
  animation-delay: -0.32s;
`

const Bounce2 = styled(Bounce)`
  animation-delay: -0.16s;
`

export default function Spinner() {
  return (
    <SpinnerWrapper>
      <Bounce1 />
      <Bounce2 />
      <Bounce />
    </SpinnerWrapper>
  )
}
