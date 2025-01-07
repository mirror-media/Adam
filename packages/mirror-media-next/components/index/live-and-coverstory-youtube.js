import styled from 'styled-components'
import YoutubeIframe from '../shared/youtube-iframe'
import { transformTimeData } from '../../utils'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 * @typedef {Object} LiveYoutubeInfo - use to play live youtube
 * @property {string} name
 * @property {string} youtubeId
 */

const Wrapper = styled.div`
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  row-gap: 40px;
  ${({ theme }) => theme.breakpoint.md} {
    padding: 40px 0;
    border-top: 2px solid #054f77;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: flex;
    flex-direction: row;
    column-gap: 64px;
    border: none;
    padding: 95px 0 86px;
  }
`

const LiveVideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.breakpoint.xl} {
    align-items: flex-start;
  }
`

const Title = styled.h2`
  color: #054f77;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  margin-bottom: 20px;
  ${({ theme }) => theme.breakpoint.xl} {
    font-size: 28px;
    font-weight: 700;
    line-height: 32.2px;
    letter-spacing: 0.5px;
    margin-bottom: 32px;
  }
`

const LiveVideoWrapper = styled.div`
  max-width: 320px;
  width: 100%;
  ${({ theme }) => theme.breakpoint.md} {
    max-width: none;
    width: 504px;
    height: 282px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 561px;
    height: 318px;
  }
`

const LatestVideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.breakpoint.xl} {
    align-items: flex-start;
  }
`

const LatestVideoList = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 28px;
  max-width: 288px;
  ${({ theme }) => theme.breakpoint.md} {
    max-width: 400px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    row-gap: 12px;
  }
`
const VideoInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 12px;
  ${({ theme }) => theme.breakpoint.xl} {
    flex-direction: row;
    column-gap: 20px;
    align-items: flex-start;
  }
`

const VideoWrapper = styled.div`
  width: 288px;
  height: 160px;
  ${({ theme }) => theme.breakpoint.md} {
    width: 400px;
    height: 222px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 180px;
    height: 100px;
    flex-shrink: 0;
    margin-bottom: 0;
  }
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  ${({ theme }) => theme.breakpoint.xl} {
    row-gap: 4px;
  }
`

const VideoTitle = styled.p`
  font-size: 18px;
  font-weight: 500;
  line-height: 27px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`

const Date = styled.p`
  font-size: 14px;
  font-weight: 400;
`

/**
 * @param {Object} props
 * @param {LiveYoutubeInfo} props.liveYoutubeInfo
 * @param {import('../../type/youtube').YoutubeVideo[]}props.youtubeCoverstoryVideos
 */
export default function LiveAndCoverstoryYoutube({
  liveYoutubeInfo,
  youtubeCoverstoryVideos,
}) {
  const { name, youtubeId: liveYoutubeId } = liveYoutubeInfo

  return (
    <Wrapper>
      {liveYoutubeId && (
        <LiveVideoContainer>
          {name && <Title>{name}</Title>}
          <LiveVideoWrapper>
            <YoutubeIframe
              videoId={liveYoutubeId}
              gtmClassName="GTM-live-yt-b"
            />
          </LiveVideoWrapper>
        </LiveVideoContainer>
      )}
      <LatestVideoContainer>
        <Title>最新影音</Title>
        <LatestVideoList>
          {youtubeCoverstoryVideos.map((latestVideo) => {
            if (!latestVideo) return null
            return (
              <VideoInfoWrapper key={latestVideo.id}>
                <VideoWrapper>
                  <YoutubeIframe
                    videoId={latestVideo.id}
                    gtmClassName="GTM-latest-video-yt-b"
                  />
                </VideoWrapper>
                <Info>
                  {latestVideo.title && (
                    <VideoTitle>{latestVideo.title}</VideoTitle>
                  )}
                  {latestVideo.publishedAt && (
                    <Date>
                      {transformTimeData(latestVideo.publishedAt, 'dash')}
                    </Date>
                  )}
                </Info>
              </VideoInfoWrapper>
            )
          })}
        </LatestVideoList>
      </LatestVideoContainer>
    </Wrapper>
  )
}
