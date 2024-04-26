import styled from 'styled-components'
import Link from 'next/link'

const StyledLink = styled(Link)`
  color: #1d9fb8;

  &:hover,
  &:active {
    border-bottom: 1px solid #1d9fb8;
  }
`

export default StyledLink
