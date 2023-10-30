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
