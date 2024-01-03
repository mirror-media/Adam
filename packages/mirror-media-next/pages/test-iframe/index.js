import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;

  iframe {
    width: 100%;
    min-height: 500px;
    ${({ theme }) => theme.breakpoint.xl} {
      min-height: 520px;
    }
  }
`
export default function TestIFrame() {
  return (
    <Wrapper>
      <iframe src="https://dev.mirrormedia.mg/projects/dev-election2024-homepage-1229/index.html"></iframe>
    </Wrapper>
  )
}
