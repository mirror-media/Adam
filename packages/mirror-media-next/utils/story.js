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

/**
 * The Function for calculate which index we want to slice the original content.
 * and amount of `content.blocks` which type is 'unstyled'.
 *
 * The reason why we need to calculate these variables is our business logic:
 * The index of slice should only count the block item which type is `unstyled`.
 *
 * Take the following array as a example, which `1` is unstyled, `0` is not unstyled.
 * ```
 * [1, 0, 0, 1, 1, 0, 1, 1, 0, 1]
 * ```
 * If the slice index is [0,2], which means we what to slice **AFTER** the first and third unstyled item, which is:
 * ```
 * [1, | 0, 0, 1, 1, | 0 , 1, 0, 1] -> [1], [0, 0, 1, 1], [0, 1, 0, 1]
 *     ^             ^
 *
 * ```
 * so we need to find the index in original array we want to slice.
 *
 * @param {Content} content
 * @param {{mb: number[], pc: number[]}} [unstyledBlockSliceIndex]
 */
const getSlicedIndexAndUnstyledBlocksCount = (
  content,
  unstyledBlockSliceIndex = { mb: [0, 4], pc: [2] }
) => {
  const hasContent = hasContentInRawContentBlock(content)
  if (hasContent) {
    const contentWithoutEmptyBlock = removeEmptyContentBlock(content)
    /**
     * @type {Content}
     */
    const newContent = JSON.parse(JSON.stringify(contentWithoutEmptyBlock))

    const unstyledContentBlocks = newContent.blocks.filter(
      (block) => block.type === 'unstyled'
    )
    /**
     *
     * @param {number[]} arr
     */
    const findSlicedIndex = (arr) => {
      return arr
        .map((i) =>
          newContent.blocks.findIndex(
            (block) => block.key === unstyledContentBlocks[i]?.key
          )
        )
        .filter((item) => item >= 0)
        .map((i) => i + 1)
    }
    const slicedIndex = {
      mb: findSlicedIndex(unstyledBlockSliceIndex.mb),
      pc: findSlicedIndex(unstyledBlockSliceIndex.pc),
    }
    const unstyledBlocksCount = unstyledContentBlocks?.length ?? 0
    return { slicedIndex, unstyledBlocksCount }
  } else {
    return { slicedIndex: { mb: [], pc: [] }, unstyledBlocksCount: 0 }
  }
}

/**
 * Convert the UTC timestamp to GMT timestamp by adding 8 hours.
 *
 * @param {string} utcTimeStamp
 * @return {string}
 */
const changeUtcToGmtTimeStamp = (utcTimeStamp) => {
  const inputDate = new Date(utcTimeStamp)
  inputDate.setHours(inputDate.getHours() + 8)
  const gmtTimeStamp = inputDate.toISOString() //change to `YYYY-MM-DDTHH:mm:ss.sssZ` format

  if (typeof gmtTimeStamp !== 'string') {
    return utcTimeStamp
  }

  return gmtTimeStamp
}

function modifyFirstImageEntity(rawContentBlock) {
  const { blocks, entityMap } = rawContentBlock

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (block.type === 'atomic') {
      for (let j = 0; j < block.entityRanges.length; j++) {
        const entityKey = block.entityRanges[j].key
        const entity = entityMap[entityKey]
        if (entity && entity.type === 'image') {
          // 修改第一個 'image'，添加 isFirstImage
          entityMap[entityKey] = {
            ...entity,
            data: {
              ...entity.data,
              isFirstImage: true,
            },
          }
          return { ...rawContentBlock, entityMap }
        }
      }
    }
  }

  return rawContentBlock
}

export {
  handleStoryPageRedirect,
  copyAndSliceDraftBlock,
  getBlocksCount,
  getSlicedIndexAndUnstyledBlocksCount,
  changeUtcToGmtTimeStamp,
  modifyFirstImageEntity,
}
