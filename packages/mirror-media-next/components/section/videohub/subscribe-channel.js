import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  margin: 20px 0 36px;
  ${({ theme }) => theme.breakpoint.md} {
    margin: 28px 0 31px;
  }
`

const Icon = styled.img`
  cursor: pointer;
`

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`

const Title = styled.p`
  font-size: 13px;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;
`

const Subscribe = styled.button`
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  color: #fff;
  background: #af1f07;
  padding: 5px 12px;
  border-radius: 2px;
  margin-top: 4px;
  outline: inherit;
`

/**
 * @typedef {Object} MirrorYoutubeChannel
 * @property {string} props.title
 * @property {string} props.id
 * @property {string} props.name
 * @property {string} props.icon
 */
/**
 * @param {Object} props
 * @param {MirrorYoutubeChannel} props.channel
 * @returns
 */
export default function SubscribeChannel({ channel }) {
  const onOpenChannel = () => {
    window.open(`https://www.youtube.com/channel/${channel.id}`, '_blank')
  }

  const onSubscribeChannel = () => {
    window.open(
      `https://www.youtube.com/channel/${channel.id}?sub_confirmation=1`,
      '_blank'
    )
  }

  return (
    <Wrapper>
      <Icon
        src={channel.icon}
        alt={channel.name}
        onClick={onOpenChannel}
        className={`GTM-video-homepage-subscribe-channel_${channel.title}`}
      />
      <DetailWrapper>
        <Title
          onClick={onOpenChannel}
          className={`GTM-video-homepage-subscribe-channel_${channel.title}`}
        >
          {channel.title}
        </Title>
        <Subscribe
          onClick={onSubscribeChannel}
          className={`GTM-video-homepage-subscribe-channel_${channel.title}`}
        >
          訂閱
        </Subscribe>
      </DetailWrapper>
    </Wrapper>
  )
}
