import styled from 'styled-components'
import { MirrorMedia } from '@mirrormedia/lilith-draft-renderer'
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
 * @returns {JSX.Element}
 */
export default function ExternalArticleContent({ content = '' }) {
  return (
    <Wrapper>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Wrapper>
  )
}
