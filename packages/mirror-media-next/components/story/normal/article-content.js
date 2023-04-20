import { MirrorMedia } from '@mirrormedia/lilith-draft-renderer'
const { DraftRenderer, hasContentInRawContentBlock } = MirrorMedia

/**
 * @typedef {import('../../../type/draft-js').Draft} Content
 */

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
  return shouldRenderContent && <DraftRenderer rawContentBlock={content} />
}
