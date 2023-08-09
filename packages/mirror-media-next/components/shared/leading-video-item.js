import styled from 'styled-components'
import YoutubeIframe from './youtube-iframe'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const Wrapper = styled.div`
  display: grid;
  width: 100%;
  grid-template:
    'youtube'
    'title';
  grid-template-columns: 320px auto;
  row-gap: 8px;
  margin-top: 16px;

  ${
    /**
     * @param {Object} props
     * @param {boolean} props.hasSlug
     * @param {Theme} [props.theme]
     */
    ({ theme }) => theme.breakpoint.md
  } {
    grid-template:
      'youtube title'
      'description description';
    column-gap: 24px;
    row-gap: 16px;
  }

  ${
    /**
     * @param {Object} props
     * @param {boolean} props.hasSlug
     * @param {Theme} [props.theme]
     */
    ({ theme }) => theme.breakpoint.xl
  } {
    grid-template:
      'youtube title' 60px
      'youtube description' auto;
    grid-template-columns: 378px auto;
    row-gap: 8px;
    margin-top: 25px;
    ${
      /**
       * @param {Object} props
       * @param {boolean} props.hasSlug
       * @param {Theme} [props.theme]
       */
      ({ hasSlug }) =>
        hasSlug &&
        `
      grid-template: 
        'youtube playlisttitle' 32px
        'youtube title' 60px
        'youtube description' auto;
      grid-template-columns: 438px auto;

    `
    }
  }
`

const Youtube = styled.div`
  grid-area: youtube;
  width: 100%;

  ${
    /**
     * @param {Object} props
     * @param {boolean} props.hasSlug
     * @param {Theme} [props.theme]
     */
    ({ theme }) => theme.breakpoint.md
  } {
    width: 320px;
  }
  ${
    /**
     * @param {Object} props
     * @param {boolean} props.hasSlug
     * @param {Theme} [props.theme]
     */
    ({ theme }) => theme.breakpoint.xl
  } {
    width: 378px;
    ${
      /**
       * @param {Object} props
       * @param {boolean} props.hasSlug
       * @param {Theme} [props.theme]
       */
      ({ hasSlug }) =>
        hasSlug &&
        `
        display: flex;
        width: 438px;
    `
    }
  }
`

const CategoryColorbox = styled.div`
  display: none;
  ${
    /**
     * @param {Object} props
     * @param {String } props.categorySlug
     * @param {Theme} [props.theme]
     */
    ({ theme }) => theme.breakpoint.xl
  } {
    display: block;
    width: 60px;
  }
  background-color: ${
    /**
     * @param {Object} props
     * @param {String } props.categorySlug
     * @param {Theme} [props.theme]
     */
    ({ categorySlug, theme }) =>
      categorySlug && theme.color.videoCategoryColor[categorySlug]
        ? theme.color.videoCategoryColor[categorySlug]
        : theme.color.brandColor.darkBlue
  };
`

const Title = styled.p`
  grid-area: title;
  font-size: 20px;
  line-height: 1.4;
  color: #4a4a4a;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  height: 56px;
  &:active,
  &:hover {
    text-decoration: underline;
  }

  ${({ theme }) => theme.breakpoint.md} {
    width: 255px;
    height: 120px;
    line-height: 1.5;
    -webkit-line-clamp: 4;
  }

  ${({ theme }) => theme.breakpoint.xl} {
    width: 517px;
    height: 60px;
    -webkit-line-clamp: 2;
  }
`

const Description = styled.p`
  grid-area: description;
  display: none;
  ${({ theme }) => theme.breakpoint.md} {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    height: 72px;
    overflow: hidden;
    font-size: 16px;
    line-height: 1.5;
    color: #9b9b9b;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 517px;
  }
`

const PlaylistTitle = styled.h2`
  grid-area: playlisttitle;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.15;
  display: none;
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
    display: block;
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
 * @typedef {Object} GtmClassName
 * @property {string} title
 * @property {import('./youtube-iframe').GtmYoutubeClassName} youtube
 *
 */

/**
 * @param {Object} props
 * @param {import('../../type/youtube').YoutubeVideo} props.video
 * @param {string} [props.slug]
 * @param {string} [props.playlistTitle]
 * @param {GtmClassName} [props.gtmClassName]
 * @returns {React.ReactElement}
 */
export default function LeadingVideoItem({
  video,
  slug,
  playlistTitle,
  gtmClassName = { title: '', youtube: '' },
}) {
  const hasSlug = !!slug
  return (
    <Wrapper hasSlug={hasSlug}>
      {hasSlug && (
        <PlaylistTitle categorySlug={slug}>{playlistTitle}</PlaylistTitle>
      )}
      <Youtube hasSlug={hasSlug}>
        <YoutubeIframe
          videoId={video.id}
          gtmClassName={gtmClassName?.youtube}
        />
        {hasSlug && <CategoryColorbox categorySlug={slug} />}
      </Youtube>

      <Title>
        <a
          href={`/video/${video.id}`}
          className={gtmClassName?.title}
          target="_blank"
          rel="noreferrer"
        >
          <span>{video.title}</span>
        </a>
      </Title>

      <Description>
        <a href={`/video/${video.id}`} target="_blank" rel="noreferrer">
          {video.description?.split('-----')[0]}
        </a>
      </Description>
    </Wrapper>
  )
}
