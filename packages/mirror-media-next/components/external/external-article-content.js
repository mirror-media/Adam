import styled from 'styled-components'
import MirrorMedia from '@mirrormedia/lilith-draft-renderer/lib/website/mirrormedia'
import ExternalEmbedCodeBlock from './external-embed-code-block'
const { draftEditorCssExternal } = MirrorMedia
import Link from 'next/link'
import Image from 'next/image'
import { Z_INDEX } from '../../constants/index'

const leftArrow = '/images-next/story/left-arrow.svg'

const Wrapper = styled.section`
  margin-top: 32px;
  ${draftEditorCssExternal}

  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 20px;
  }

  iframe {
    max-width: 100%;
  }

  .amp-img-wrapper {
    margin-top: 20px;
    width: 100%;
    height: 50vw;
    position: relative;
    display: flex;
    justify-content: center;
    img {
      object-fit: contain;
    }
  }
  .amp-iframe-wrapper {
    display: block;
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    overflow: hidden;
  }
`
const ImageWrapper = styled.div`
  padding: 16px;
  position: fixed;
  bottom: 25%;
  right: 0;
  z-index: ${Z_INDEX.storyLeftArrow};
`
/**
 *
 * @param {Object} props
 * @param {string} props.content
 * @param {Array} props.allRelatedStories
 * @param {boolean} props.isMobileWidth
 * @returns {import('react').JSX.Element}
 */
export default function ExternalArticleContent({
  content = '',
  allRelatedStories = [],
  isMobileWidth,
}) {
  const iframeRegex = /(<iframe[\s\S]*?<\/iframe>)/i
  const parts = content.split(iframeRegex).filter((p) => p.trim())
  const hasFirstRelatedArticle = allRelatedStories.length
    ? allRelatedStories[0]
    : null
  return (
    <Wrapper>
      {parts.map((part, index) => {
        if (iframeRegex.test(part)) {
          return <ExternalEmbedCodeBlock embedCode={part} key={index} />
        }
        return <div dangerouslySetInnerHTML={{ __html: part }} key={index} />
      })}

      {isMobileWidth && hasFirstRelatedArticle && (
        <Link
          href={
            allRelatedStories[0].url ??
            `${
              allRelatedStories[0].__typename === 'Post'
                ? '/story'
                : '/external'
            }/${allRelatedStories[0].slug}`
          }
          target="_blank"
        >
          <ImageWrapper>
            <Image
              src={leftArrow}
              width={24}
              height={24}
              alt="點按看下一則延伸閱讀"
            />
          </ImageWrapper>
        </Link>
      )}
    </Wrapper>
  )
}
