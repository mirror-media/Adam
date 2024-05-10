import styled from 'styled-components'

const AMOUNT_OF_DOTS = 3
const ANIMATION_DELAY = 0.15 // in second
const ANIMATION_DURATION = ANIMATION_DELAY * AMOUNT_OF_DOTS

const Wrapper = styled.div`
  display: flex;
  flex-direaction: row;
  column-gap: 8px;
  background-color: transparent;

  @keyframes loading-effect {
    0% {
      opacity: 0.3;
    }
    100% {
      opacity: 0.8;
    }
  }
`

const Dot = styled.div`
  background-color: #fff;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  animation: loading-effect ${ANIMATION_DURATION}s linear infinite;
`

export default function PrimaryButtonLoadingEffect() {
  const dots = new Array(AMOUNT_OF_DOTS)
    .fill(0)
    .map((_, idx) => (
      <Dot key={idx} style={{ animationDelay: `${ANIMATION_DELAY * idx}s` }} />
    ))
  return <Wrapper>{dots}</Wrapper>
}
