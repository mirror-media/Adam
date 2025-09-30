import styled from 'styled-components'
import MirrorMedia from '@mirrormedia/lilith-draft-renderer/lib/website/mirrormedia'
import ExternalEmbedCodeBlock from './external-embed-code-block'
const { draftEditorCssExternal } = MirrorMedia

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

/**
 *
 * @param {Object} props
 * @param {string} props.content
 * @returns {import('react').JSX.Element}
 */
export default function ExternalArticleContent({ content = '' }) {
  const iframeRegex = /(<iframe[\s\S]*?<\/iframe>)/i
  const parts = content.split(iframeRegex).filter((p) => p.trim())
  return (
    <Wrapper>
      {parts.map((part, index) => {
        if (iframeRegex.test(part)) {
          return <ExternalEmbedCodeBlock embedCode={part} key={index} />
        }
        return <div dangerouslySetInnerHTML={{ __html: part }} key={index} />
      })}
    </Wrapper>
  )
}
