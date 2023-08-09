import { useState, useEffect } from 'react'
import { MirrorMedia } from '@mirrormedia/lilith-draft-renderer'
const { DraftRenderer, hasContentInRawContentBlock, removeEmptyContentBlock } =
  MirrorMedia

/**
 * @typedef { 'normal' | 'wide' | 'photography' | 'premium' | 'amp' } ContentLayout
 */

/**
 * @typedef {import('../../../type/draft-js').Draft} RawContentBlock
 */

/**
 * @callback WrapperFunction
 * @param {JSX.Element} children - The React element to wrap.
 * @returns {JSX.Element} The wrapped React element.
 */

/**
 * Component for render blocks of draft.js
 * We use package `@mirrormedia/draft-renderer` to render the block of draft.js
 * @param {Object} props
 * @param {RawContentBlock} props.rawContentBlock - The blocks of draft.js we want to render.
 * @param { ContentLayout } [props.contentLayout]
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
  const isAmp = contentLayout === 'amp'
  const shouldRenderDraft = hasContentInRawContentBlock(rawContentBlock)

  const jsx = isAmp
    ? AmpRenderBlock(rawContentBlock, contentLayout)
    : NormalRenderBlock(rawContentBlock, contentLayout)

  return <>{shouldRenderDraft && wrapper(jsx)}</>
}
/**
 *
 * @param {RawContentBlock} rawContentBlock
 * @param {ContentLayout} contentLayout
 * @returns {JSX.Element}
 */
function NormalRenderBlock(rawContentBlock, contentLayout) {
  const shouldRenderDraft = hasContentInRawContentBlock(rawContentBlock)
  const [draftRenderBlockJsx, setDraftRenderBlockJsx] = useState(null)

  useEffect(() => {
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
  }, [shouldRenderDraft, rawContentBlock, contentLayout])

  return draftRenderBlockJsx
}
/**
 * There is no client-side rendering in amp page, so `useState`, `useEffect` is unable to used.
 * Because the limitation mentioned above, it is needed to use `DraftRenderer` in server-side, which may cause issue of memory leak.
 * @param {RawContentBlock} rawContentBlock
 * @param {ContentLayout} contentLayout
 * @returns {JSX.Element}
 */
function AmpRenderBlock(rawContentBlock, contentLayout) {
  const shouldRenderDraft = hasContentInRawContentBlock(rawContentBlock)
  let draftJsx = null

  if (shouldRenderDraft) {
    const contentWithRemovedEmptyBlock =
      removeEmptyContentBlock(rawContentBlock)
    draftJsx = (
      <DraftRenderer
        rawContentBlock={contentWithRemovedEmptyBlock}
        contentLayout={contentLayout}
      />
    )
  }

  return draftJsx
}
