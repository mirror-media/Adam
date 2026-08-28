import Image from 'next/image'
import type { RawDraftContentState } from 'draft-js'

import { Typography } from '@/components/ui'

type BlocksProps = {
  contents: RawDraftContentState
  className?: string
  renderPostInContent?: (
    block: RawDraftContentState['blocks'][0],
    paragraphCount: number
  ) => React.ReactNode
  renderAdInContent?: () => React.ReactNode
}

export function Blocks({
  contents,
  className,
  renderPostInContent,
}: BlocksProps) {
  let paragraphCount = 0
  let headingCount = 0

  return contents.blocks.map((block, index) => {
    switch (block?.type) {
      case 'header-two':
        headingCount = headingCount + 1
        return (
          <Typography
            key={`heading-${headingCount}`}
            id={`heading-${headingCount}`}
            as="h2"
            variant="h2"
            className={className}
          >
            {block?.text}
          </Typography>
        )
      case 'header-three':
        headingCount = headingCount + 1
        return (
          <Typography
            key={`heading-${headingCount}`}
            id={`heading-${headingCount}`}
            as="h3"
            variant="h3"
            className={className}
          >
            {block?.text}
          </Typography>
        )
      case 'header-four':
        headingCount = headingCount + 1
        return (
          <Typography
            key={`heading-${headingCount}`}
            id={`heading-${headingCount}`}
            as="h4"
            variant="h4"
            className={className}
          >
            {block?.text}
          </Typography>
        )
      case 'header-five':
        headingCount = headingCount + 1
        return (
          <Typography
            key={`heading-${headingCount}`}
            id={`heading-${headingCount}`}
            as="h5"
            variant="h5"
            className={className}
          >
            {block?.text}
          </Typography>
        )
      case 'header-six':
        headingCount = headingCount + 1
        return (
          <Typography
            key={`heading-${headingCount}`}
            id={`heading-${headingCount}`}
            as="h6"
            variant="h6"
            className={className}
          >
            {block?.text}
          </Typography>
        )
      case 'atomic':
        return block.entityRanges.map((entityRange) => {
          const entity = contents.entityMap[entityRange.key]

          if (entity.type === 'image') {
            return (
              <figure key={`content-${index}`} className={className}>
                <picture className="relative block aspect-3/2">
                  <Image
                    src={entity.data.resized.original}
                    alt={entity.data.desc ?? ''}
                    fill
                  />
                </picture>

                {entity.data.desc && (
                  <Typography
                    as="figcaption"
                    variant="caption-l"
                    className="pt-2 text-center text-mm-neutral-500 md:text-start"
                  >
                    {entity.data.desc}
                  </Typography>
                )}
              </figure>
            )
          }

          if (entity.type === 'YOUTUBE') {
            return (
              <iframe
                key={entity.data.youtubeId}
                title={entity.data.description}
                src={'https://www.youtube.com/embed/' + entity.data.youtubeId}
                className="aspect-video"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            )
          }

          return null
        })
      case 'unstyled':
        paragraphCount = paragraphCount + 1

        return renderPostInContent?.(block, paragraphCount)

      default:
        return null
    }
  })
}
