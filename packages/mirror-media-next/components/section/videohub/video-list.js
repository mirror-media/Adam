import styled from 'styled-components'
import VideoListItem from '../../shared/video-list-item'

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

const Wrapper = styled.div`
  overflow: hidden;
  ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     * @param {boolean} props.hasSlug
     */
    ({ hasSlug, theme }) => {
      if (hasSlug) {
        return `
          margin-top: 20px;
          ${theme.breakpoint.md} {
            margin-top: 24px;
          }
          ${theme.breakpoint.xl} {
            margin-top: 44px;
          }
        `
      } else {
        return `
          margin-top: 20px;
          border-bottom: 4px solid #f5f5f5;
          padding: 0 16px 20px;

          ${theme.breakpoint.md} {
            margin-top: 28px;
            padding: 0 0 24px;
          }
          ${theme.breakpoint.xl} {
            margin-top: 20px;
            padding: 0 0 44px;
          }
        `
      }
    }
  }
`

const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.15;

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
  }
`

const VideoItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: scroll;
  row-gap: 16px;
  margin-top: 16px;
  ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     * @returns
     */
    ({ theme }) => theme.breakpoint.md
  } {
    flex-direction: row;
    column-gap: 20px;
    row-gap: unset;
  }
  ${
    /**
     * @param {Object} props
     * @param {Theme} props.theme
     * @returns
     */
    ({ theme }) => theme.breakpoint.xl
  } {
    column-gap: 23px;
    margin-top: 20px;
  }
  > * {
    flex-shrink: 0;
  }
`

/**
 * @typedef {import('../../shared/video-list-item').GtmClassName} GtmClassName
 */

/**
 * @param {Object} props
 * @param {import('../../../type/youtube').YoutubeVideo[]} props.videos
 * @param {string} props.name
 * @param {string} [props.slug]
 * @param {GtmClassName} [props.gtmClassName]
 * @returns {React.ReactElement}
 */
export default function VideoList({ videos, name, slug, gtmClassName = '' }) {
  const hasSlug = !!slug
  return (
    <Wrapper hasSlug={hasSlug}>
      <Title categorySlug={slug}>
        {hasSlug ? (
          <a href={`/video_category/${slug}`} target="_blank" rel="noreferrer">
            {name}
          </a>
        ) : (
          <>{name}</>
        )}
      </Title>

      <VideoItemsWrapper>
        {videos.map((video) => (
          <VideoListItem
            key={video.title}
            video={video}
            slug={slug}
            gtmClassName={gtmClassName}
          />
        ))}
      </VideoItemsWrapper>
    </Wrapper>
  )
}
