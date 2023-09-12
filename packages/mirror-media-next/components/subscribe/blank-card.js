import styled from 'styled-components'

const CardWrapper = styled.div`
  margin: auto;

  ${({ theme }) => theme.breakpoint.md} {
    border-radius: 24px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #fff;
    box-shadow: 0px 4px 28px 0px rgba(0, 0, 0, 0.06),
      0px 2px 12px 0px rgba(0, 0, 0, 0.08);
    width: 468px;
    padding: 40px;
  }
`

export default function BlankCard({ children }) {
  return <CardWrapper>{children}</CardWrapper>
}
