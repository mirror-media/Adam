//TODO: add real GptAd

import styled from 'styled-components'

const GptAdWrapper = styled.div`
  height: 42px;
  width: 80px;
  margin-right: auto;
  background-color: gray;
  ${({ theme }) => theme.breakpoint.md} {
    order: -1;
    margin-right: 0;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin-left: 20px;
    margin-right: auto;
    height: 50px;
    width: 95px;
    order: 0;
  }
`
export default function GptAd() {
  return <GptAdWrapper>GptAd</GptAdWrapper>
}
