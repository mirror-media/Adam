import { useState, useEffect } from 'react'
import { MirrorMedia } from '@mirrormedia/lilith-draft-renderer'
const { DraftRenderer, hasContentInRawContentBlock, removeEmptyContentBlock } =
  MirrorMedia

/**
 * @callback WrapperFunction
 * @param {JSX.Element} children - The React element to wrap.
 * @returns {JSX.Element} The wrapped React element.
 */

/**
 * Component for render blocks of draft.js
 * We use package `@mirrormedia/draft-renderer` to render the block of draft.js
 * @param {Object} props
 * @param {import('../../../type/draft-js').Draft} props.rawContentBlock - The blocks of draft.js we want to render.
 * @param { 'normal' | 'wide' | 'photography' | 'premium' | 'amp' } [props.contentLayout]
 * - Which layout we want to render.
 * - Different layout will affect the style of blocks.
 * - Optional, default value is `normal`
 * @param {WrapperFunction} [props.wrapper]
 * - The function to wrap all blocks, you can use it to put all blocks in a jsx element.
 * - Optional, default value is `(children) => <>{children}</>`.
 * @returns  {JSX.Element}
 */
export default function DraftRenderBlock({
  rawContentBlock = { blocks: [], entityMap: {} },
  contentLayout = 'normal',
  wrapper = (children) => <>{children}</>,
}) {
  const [draftRenderBlockJsx, setDraftRenderBlockJsx] = useState(null)

  useEffect(() => {
    const shouldRenderDraft = hasContentInRawContentBlock(rawContentBlock)
    if (shouldRenderDraft) {
      const contentWithRemovedEmptyBlock =
        removeEmptyContentBlock(rawContentBlock)
      /**
       * Because `draft.js` has memory leak issue, so it is needed to prevent use `DraftRenderer` on server-side.
       * @see [GitHub issue](https://github.com/facebookarchive/draft-js/issues/2391)
       */
      const jsx = (
        <DraftRenderer
          rawContentBlock={contentWithRemovedEmptyBlock}
          contentLayout={contentLayout}
        />
      )
      setDraftRenderBlockJsx(jsx)
    }
  }, [rawContentBlock, contentLayout])

  return <>{wrapper(draftRenderBlockJsx)}</>
}
