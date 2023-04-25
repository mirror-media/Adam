import styled from 'styled-components'
import { MirrorMedia } from '@mirrormedia/lilith-draft-renderer'
const { DraftRenderer, hasContentInRawContentBlock, removeEmptyContentBlock } =
  MirrorMedia

/**
 * @typedef {import('../../../type/draft-js').Draft} Content
 */

const Wrapper = styled.section`
  margin-top: 32px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-top: 20px;
  }
`

/**
 *
 * @param {Object} props
 * @param {Content} props.content
 * @returns {JSX.Element}
 */
export default function ArticleContent({
  content = { blocks: [], entityMap: {} },
}) {
  const shouldRenderContent = hasContentInRawContentBlock(content)
  let contentJsx = null

  if (shouldRenderContent) {
    const contentWithRemovedEmptyBlock = removeEmptyContentBlock(content)
    contentJsx = (
      <Wrapper>
        <DraftRenderer rawContentBlock={contentWithRemovedEmptyBlock} />
      </Wrapper>
    )
  }

  return <>{contentJsx}</>
}
