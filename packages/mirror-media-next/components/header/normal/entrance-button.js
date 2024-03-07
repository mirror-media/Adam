import styled from 'styled-components'

import Link from 'next/link'
const StyledButton = styled.button`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    width: ${
      /**
       * @param {Object} param
       * @param {string} param.width
       */ ({ width }) => width || '141px'
    };
    background-color: rgba(0, 0, 0, 1);
    color: white;
    text-align: center;
    margin-left: 12px;
    :hover {
      color: #61b8c6;
      transition: all 0.2s ease-in-out;
    }
  }
`

export default function EntranceButton({ children, width, href }) {
  return (
    <StyledButton width={width}>
      <Link href={href} target="_blank">
        {children}
      </Link>
    </StyledButton>
  )
}
