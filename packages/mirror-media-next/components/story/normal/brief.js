import styled from 'styled-components'
import { convertFromRaw, Editor, EditorState } from 'draft-js'

import { atomicBlockRenderer } from '../../draft/block-redender-fn'
import decorators from '../../draft/entity-decorator'

/**
 * @typedef {import('../../../type/theme').Theme} Theme
 */

const BriefContainer = styled.div`
  color: white;
  background-color: ${
    /**
     * @param {Object} props
     * @param {String} props.sectionSlug
     * @param {Theme} [props.theme]
     */
    ({ theme, sectionSlug }) =>
      sectionSlug && theme.color.sectionsColor[sectionSlug]
        ? theme.color.sectionsColor[sectionSlug]
        : theme.color.brandColor.darkBlue
  };
  padding: 16px 24px;
  font-weight: 500;
  font-size: 18px;
  line-height: 36px;
  ${({ theme }) => theme.breakpoint.md} {
    font-weight: 400;
    font-size: 19.2px;
    padding: 19.2px 48.6px 20.8px 28.4px;
  }
`
/**
 *
 * @param {Object} props
 * @param {Object} props.brief
 * @param {String} [props.sectionSlug]
 * @returns {JSX.Element}
 */
export default function ArticleBrief({
  brief = { blocks: [], entityMap: {} },
  sectionSlug = '',
}) {
  const contentState = convertFromRaw(brief)
  const editorState = EditorState.createWithContent(contentState, decorators)

  const blockRendererFn = (block) => {
    const atomicBlockObj = atomicBlockRenderer(block)
    return atomicBlockObj
  }

  return (
    <BriefContainer sectionSlug={sectionSlug}>
      <Editor
        onChange={() => {}}
        editorState={editorState}
        readOnly
        editorKey="editor"
        blockRendererFn={blockRendererFn}
      />
    </BriefContainer>
  )
}
