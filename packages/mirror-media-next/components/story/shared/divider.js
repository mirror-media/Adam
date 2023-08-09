import styled from 'styled-components'
const DivideLine = styled.hr`
  background-color: #000000;
  width: 208px;
  height: 2px;
  margin: 32px auto 36px;
  ${({ theme }) => theme.breakpoint.md} {
    width: 100%;
    margin: 36px auto;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`
/**
 * For divide two article-list
 * @returns {JSX.Element}
 */
export default function Divider() {
  return <DivideLine />
}
