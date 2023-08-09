import styled from 'styled-components'
import YoutubePolicy from './youtube-policy'
import LeadingVideoItem from './leading-video-item'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const Wrapper = styled.div`
  margin-top: 20px;
  padding-bottom: 8px;
  border-bottom: 4px solid #f5f5f5;
  ${({ theme }) => theme.breakpoint.md} {
    padding-bottom: 12px;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    padding-bottom: 8px;
  }
`

const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.15;
  ${
    /**
     * @param {Object} props
     * @param {String } props.categorySlug
     * @param {Theme} [props.theme]
     */
    ({ theme }) => theme.breakpoint.md
  } {
    font-size: 20px;
    font-weight: 600;
  }
  ${
    /**
     * @param {Object} props
     * @param {String } props.categorySlug
     * @param {Theme} [props.theme]
     */
    ({ theme }) => theme.breakpoint.xl
  } {
    font-size: 28px;
    ${
      /**
       * @param {Object} props
       * @param {String } props.categorySlug
       * @param {Theme} [props.theme]
       */
      ({ categorySlug }) => !!categorySlug && 'display: none;'
    }
  }
  color: ${
    /**
     * @param {Object} props
     * @param {String } props.categorySlug
     * @param {Theme} [props.theme]
     */
    ({ categorySlug, theme }) =>
      categorySlug && theme.color.videoCategoryColor[categorySlug]
        ? theme.color.videoCategoryColor[categorySlug]
        : 'black'
  };
`

/**
 * @typedef {import('./leading-video-item').GtmClassName} GtmClassName
 */

/**
 * @param {Object} props
 * @param {import('../../type/youtube').YoutubeVideo} props.video
 * @param {string} props.title
 * @param {string} [props.slug]
 * @param {GtmClassName} [props.gtmClassName]
 * @returns {React.ReactElement}
 */
export default function LeadingVideo({
  video,
  title,
  slug,
  gtmClassName = { title: '', youtube: '' },
}) {
  return (
    <Wrapper>
      {title && <Title categorySlug={slug}>{title}</Title>}
      {video && (
        <LeadingVideoItem
          video={video}
          slug={slug}
          playlistTitle={title}
          gtmClassName={gtmClassName}
        />
      )}
      <YoutubePolicy />
    </Wrapper>
  )
}
