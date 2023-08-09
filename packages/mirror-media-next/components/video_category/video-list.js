import styled from 'styled-components'
import dynamic from 'next/dynamic'

import useWindowDimensions from '../../hooks/use-window-dimensions'
import VideoListItem from '../shared/video-list-item'
import { mediaSize } from '../../styles/media'
import { useDisplayAd } from '../../hooks/useDisplayAd'

const GPTAd = dynamic(() => import('../../components/ads/gpt/gpt-ad'), {
  ssr: false,
})

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 288px;
  justify-content: center;
  row-gap: 16px;
  margin-top: 16px;

  ${({ theme }) => theme.breakpoint.md} {
    grid-template-columns: repeat(3, 186px);
    gap: 24px 19px;
    margin-top: 28px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    grid-template-columns: repeat(4, 238px);
    gap: 48px 23px;
    margin-top: 36px;
  }
`

const StyledGPTAd_PC_FT = styled(GPTAd)`
  display: none;

  ${({ theme }) => theme.breakpoint.xl} {
    width: 100%;
    height: auto;
    margin: 20px auto 0px;
    max-width: 970px;
    max-height: 250px;
    display: block;
  }
`

const StyledGPTAd_MB_FT = styled(GPTAd)`
  width: 100%;
  height: auto;
  max-width: 336px;
  max-height: 280px;
  margin: 20px auto 0px;

  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`

/**
 * @param {Object} props
 * @param {import('../../type/youtube').YoutubeVideo[]} props.videos
 * @returns {React.ReactElement}
 */
export default function VideoList({ videos }) {
  const shouldShowAd = useDisplayAd()
  const { width } = useWindowDimensions()
  const isDesktopWidth = width >= mediaSize.xl

  /**
   * Renders a video list component with a maximum of 16 videos displayed at the top,
   * followed by an Pc ad component, and the remaining videos displayed below.
   *
   * @return {JSX.Element} The JSX code for the PC video list.
   */
  const renderPcVideoList = () => (
    <>
      <Wrapper>
        {videos.slice(0, 12).map((video) => (
          <VideoListItem
            key={video.id}
            video={video}
            gtmClassName="GTM-video-section-list"
          />
        ))}
      </Wrapper>
      {shouldShowAd && <StyledGPTAd_PC_FT pageKey="videohub" adKey="PC_FT" />}
      <Wrapper>
        {videos.slice(12).map((video) => (
          <VideoListItem
            key={video.id}
            video={video}
            gtmClassName="GTM-video-section-list"
          />
        ))}
      </Wrapper>
    </>
  )

  /**
   * Renders a video list component with a maximum of 6 videos displayed at the top,
   * followed by an Mb ad component, and the remaining videos displayed below.
   *
   * @return {JSX.Element} The rendered video list component.
   */
  const renderMbVideoList = () => (
    <>
      <Wrapper>
        {videos.slice(0, 6).map((video) => (
          <VideoListItem
            key={video.id}
            video={video}
            gtmClassName="GTM-video-section-list"
          />
        ))}
      </Wrapper>
      {shouldShowAd && <StyledGPTAd_MB_FT pageKey="videohub" adKey="MB_FT" />}
      <Wrapper>
        {videos.slice(6).map((video) => (
          <VideoListItem
            key={video.id}
            video={video}
            gtmClassName="GTM-video-section-list"
          />
        ))}
      </Wrapper>
    </>
  )

  return <>{isDesktopWidth ? renderPcVideoList() : renderMbVideoList()}</>
}
