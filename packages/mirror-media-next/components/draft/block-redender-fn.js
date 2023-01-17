import { DividerBlock } from './divider'
import { EmbeddedCodeBlock } from './embedded-code'
import { ImageBlock } from './image'
import { MediaBlock } from './media'
import { TableBlock } from './table'

const AtomicBlock = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0))
  const entityType = entity.getType()

  switch (entityType) {
    case 'audioLink':
    case 'imageLink':
    case 'videoLink': {
      return MediaBlock(entity)
    }
    case 'image': {
      return ImageBlock(entity)
    }
    case 'EMBEDDEDCODE': {
      return EmbeddedCodeBlock(entity)
    }
    case 'DIVIDER': {
      return DividerBlock()
    }
    case 'TABLE': {
      return TableBlock(props)
    }
  }
  return null
}

export function atomicBlockRenderer(block) {
  const blockType = block.getType()
  switch (blockType) {
    case 'atomic': {
      return {
        component: AtomicBlock,
        editable: false,
      }
    }
  }
  return null
}
