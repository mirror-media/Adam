import styled from 'styled-components'
import DraftRenderBlock from '../shared/draft-renderer-block'
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
  return (
    <DraftRenderBlock
      rawContentBlock={content}
      contentLayout="normal"
      wrapper={(children) => <Wrapper>{children}</Wrapper>}
    />
  )
}
