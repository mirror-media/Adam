import styled from 'styled-components'

import Link from 'next/link'
const SubscribeMagazineButton = styled.button`
  display: block;
  width: 68px;
  background-color: rgba(0, 0, 0, 1);
  color: white;
  text-align: center;
  border-radius: 4px;
  color: #fff;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  line-height: 150%;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

export default function SubscribeMagazineBtn() {
  return (
    <SubscribeMagazineButton>
      <Link href="/papermag" target="_blank">
        訂閱
        <br />
        紙本雜誌
      </Link>
    </SubscribeMagazineButton>
  )
}
