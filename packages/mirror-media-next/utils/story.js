import { MirrorMedia } from '@mirrormedia/lilith-draft-renderer'
const { removeEmptyContentBlock, hasContentInRawContentBlock } = MirrorMedia

/**
 * @typedef {Object} Redirect
 * @property {{ destination: string, permanent: boolean }} redirect
 */
/**
 *
 * Decide whether to redirect, or should redirect to external URL, or `story/[slug]` page.
 * @param {string} redirect - post's redirect URL
 * @returns {Redirect}
 */

const handleStoryPageRedirect = (redirect) => {
  if (redirect && redirect.trim()) {
    const redirectHref = redirect.trim()
    if (
      redirectHref.startsWith('https://') ||
      redirectHref.startsWith('http://')
    ) {
      return {
        redirect: {
          destination: `${redirectHref} `,
          permanent: false,
        },
      }
    } else if (redirectHref.startsWith('www.')) {
      return {
        redirect: {
          destination: `https://${redirectHref}`,
          permanent: false,
        },
      }
    } else {
      return {
        redirect: {
          destination: `/story/${redirectHref} `,
          permanent: false,
        },
      }
    }
  }
}

/**
 * @typedef {import('../type/draft-js').Draft} Content
 */

/**
 * Copy draft data and returns a new data after slice.
 *
 * @param {Content} content - The original draft data object.
 * @param {number} startIndex - The start index of the block to slice.
 * @param {number} [endIndex] - The end index of the block to slice.
 * @return {Content}
 */
const copyAndSliceDraftBlock = (
  content = { blocks: [], entityMap: {} },
  startIndex,
  endIndex
) => {
  const shouldRenderDraft = hasContentInRawContentBlock(content)

  if (shouldRenderDraft) {
    const contentWithoutEmptyBlock = removeEmptyContentBlock(content)
    const newContent = JSON.parse(JSON.stringify(contentWithoutEmptyBlock))

    if (newContent.blocks.length >= endIndex) {
      newContent.blocks = newContent.blocks.slice(startIndex, endIndex)
    } else if (newContent.blocks.length > startIndex) {
      newContent.blocks = newContent.blocks.slice(startIndex)
    } else {
      return { blocks: [], entityMap: {} }
    }

    return newContent
  }
}

/**
 * Return the total number of non-empty content blocks.
 *
 * @param {Content} content
 * @return {number} The number of non-empty content blocks.
 */

const getBlocksCount = (content) => {
  if (hasContentInRawContentBlock(content)) {
    return removeEmptyContentBlock(content).blocks.length
  } else {
    return 0
  }
}

export { handleStoryPageRedirect, copyAndSliceDraftBlock, getBlocksCount }
