import styled from 'styled-components'

import YoutubeIframe from './shared/youtube-iframe'

/**
 * @typedef {Object} LiveYoutubeInfo - use to play live youtube
 * @property {string} name
 * @property {string} youtubeId
 */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px 0;
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 40px 0;
  }
`

const LiveTitle = styled.h2`
  background-color: rgb(29, 159, 184);
  color: white;
  margin-bottom: 24px;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.15;
  padding: 8px;
  letter-spacing: 0.5px;
  border-radius: 4px;
`

const YoutubeWrapper = styled.div`
  width: 321px;
  ${({ theme }) => theme.breakpoint.md} {
    width: 504px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 480px;
  }
`

/**
 * @param {Object} props
 * @param {LiveYoutubeInfo} props.liveYoutubeInfo
 */
export default function LiveYoutube({ liveYoutubeInfo }) {
  const { name, youtubeId } = liveYoutubeInfo
  if (!youtubeId) {
    return null
  }
  return (
    <Wrapper>
      {name && <LiveTitle>{name}</LiveTitle>}
      <YoutubeWrapper>
        <YoutubeIframe videoId={youtubeId} />
      </YoutubeWrapper>
    </Wrapper>
  )
}
