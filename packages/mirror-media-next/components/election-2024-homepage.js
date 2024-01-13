import styled from 'styled-components'

import { ELECTION_2024 } from '../config/index.mjs'
const Wrapper = styled.div`
  position: relative;
  padding-top: 20px;
  iframe {
    background-color: #f5f5f5;
    height: 480px;
    width: 100%;
    ${({ theme }) => theme.breakpoint.xl} {
      height: 520px;
    }
  }
`

//  {/* <iframe src="https://dev.mirrormedia.mg/projects/dev-election2024-homepage-0110-7/index.html"></iframe> */}
export default function Election2024Homepage({ className = '' }) {
  return (
    <Wrapper className={className}>
      <iframe src={ELECTION_2024.url}></iframe>
    </Wrapper>
  )
}
