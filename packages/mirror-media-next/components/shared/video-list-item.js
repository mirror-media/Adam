import styled from 'styled-components'
import Image from '@readr-media/react-image'

/**
 * @typedef {import('../../type/theme').Theme} Theme
 */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 288px;
  ${({ theme }) => theme.breakpoint.md} {
    width: 186px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 238px;
  }
`

const CategoryColorbox = styled.div`
  height: 8px;
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
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

const ImageWrapper = styled.div`
  position: relative;
  padding-top: 56.25%;
  overflow: hidden;
  > img {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
`

const Title = styled.p`
  font-size: 14px;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.87);
  margin-top: 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  height: 39.2px;
  &:active,
  &:hover {
    text-decoration: underline;
  }
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 12px;
    line-height: 1.5;
    height: 42px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin-top: 16px;
    font-size: 16px;
    height: 48px;
  }
`

/**
 * @typedef {string} GtmClassName
 */

/**
 * @param {Object} props
 * @param {import('../../type/youtube').YoutubeVideo} props.video
 * @param {string} [props.slug]
 * @param {GtmClassName} [props.gtmClassName]
 * @returns {React.ReactElement}
 */
export default function VideoListItem({ video, slug, gtmClassName = '' }) {
  const hasSlug = !!slug
  return (
    <Wrapper>
      {hasSlug && <CategoryColorbox categorySlug={slug} />}
      <a
        href={`/video/${video.id}`}
        target="_blank"
        rel="noreferrer"
        className={gtmClassName}
      >
        <ImageWrapper>
          <Image
            images={{ original: video.thumbnail }}
            loadingImage="/images/loading.gif"
            defaultImage="/images/default-og-img.png"
            alt={video.title}
          />
        </ImageWrapper>
      </a>
      <Title>
        <a
          href={`/video/${video.id}`}
          target="_blank"
          rel="noreferrer"
          className={gtmClassName}
        >
          {video.title}
        </a>
      </Title>
    </Wrapper>
  )
}
