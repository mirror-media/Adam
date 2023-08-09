import styled from 'styled-components'
import { MIRROR_YOUTUBE_CHANNELS } from '../../../constants'
import SubscribeChannel from './subscribe-channel'

const Wrapper = styled.div`
  display: flex;
  border-bottom: 4px solid #f5f5f5;
  column-gap: 28px;
  overflow: scroll;
  ${({ theme }) => theme.breakpoint.md} {
    column-gap: 40px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    justify-content: space-between;
  }
  > * {
    flex-shrink: 0;
  }
`

export default function SubscribeChannels() {
  return (
    <Wrapper>
      {MIRROR_YOUTUBE_CHANNELS.map((channel) => (
        <SubscribeChannel key={channel.id} channel={channel} />
      ))}
    </Wrapper>
  )
}
