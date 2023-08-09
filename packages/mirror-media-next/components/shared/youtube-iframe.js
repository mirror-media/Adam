import styled from 'styled-components'

const IframeWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  overflow: hidden;
`
const Iframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
`

/**
 * @typedef {string} GtmYoutubeClassName
 */

/**
 * Why we add parameter `enablejsapi` in youtube iframe attribute `src`?
 * Because we need to track gtm event when playing youtube video, the only way to achieve this is to add param.
 * see [Youtube API](https://developers.google.com/youtube/player_parameters?hl=zh-tw#enablejsapi) to get more info.
 * @param {Object} props
 * @param {string} props.videoId
 * @param {GtmYoutubeClassName} [props.gtmClassName]
 * @returns
 */
export default function YoutubeIframe({ videoId, gtmClassName = '' }) {
  return (
    <IframeWrapper>
      <Iframe
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
        loading="lazy"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={gtmClassName}
      />
    </IframeWrapper>
  )
}
