import styled from 'styled-components'

import Link from 'next/link'
const PodcastButton = styled.button`
  display: block;
  padding: 4px;
  background-color: #61b8c6;
  color: white;
  text-align: center;
  border-radius: 4px;
  color: #fff;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  line-height: 150%;
  font-size: 14px;
  font-weight: 600;
  line-height: 150%; /* 21px */

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

export default function EnterPodcastBtn() {
  return (
    <PodcastButton>
      <Link href="/podcasts" target="_blank">
        Podcasts
      </Link>
    </PodcastButton>
  )
}
