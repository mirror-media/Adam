import Image from 'next/image'
import type { RawDraftContentBlock } from 'draft-js'

import { cn } from '@/components/cn'
import { Typography } from '@/components/ui'
import { StoryPost } from '@/modules/story/story-types'

import { RelativePostLink } from './relative-post-link'
import { type ElementVariantProps, ThemeElement } from './theme-element'

type BlocksProps = {
  contents: RawDraftContentBlock[]
  relatedsOne: StoryPost['relatedsOne']
  relatedsTwo: StoryPost['relatedsTwo']
  theme: ElementVariantProps['theme']
  className?: string
  renderAdInContent?: () => React.ReactNode
}

export function Blocks({
  contents,
  relatedsOne,
  relatedsTwo,
  theme,
  className,
  renderAdInContent,
}: BlocksProps) {
  let paragraphCount = 0
  let headingCount = 0

  return contents.map((block, index) => {
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
        return (
          <figure
            key={`content-${index}`}
            className={cn('relative block h-[18.75rem] w-full', className)}
          >
            {block?.data?.file?.url && (
              <Image
                src={block.data.file.url}
                alt={block.data.file.caption ?? ''}
                fill
              />
            )}
            {block?.data?.file?.caption && (
              <Typography
                as="figcaption"
                variant="caption-l"
                className="pt-2 text-center text-mm-neutral-500 md:text-start"
              >
                {block?.data?.file?.caption}
              </Typography>
            )}
          </figure>
        )
      case 'unstyled':
        if (!block?.text) return null

        paragraphCount = paragraphCount + 1

        if (paragraphCount === 2) {
          return (
            <>
              <Typography
                key={`content-${index}`}
                as="p"
                variant="body-l"
                className={className}
              >
                {block?.text}
              </Typography>
              <div className={className}>
                <ThemeElement className="inline rounded-md rounded-b-none bg-mm-second-700 px-3 pt-1 text-mm-neutral-100">
                  延伸閱讀
                </ThemeElement>
                <ThemeElement
                  className="rounded-md rounded-tl-none p-2"
                  as="div"
                  theme={theme}
                >
                  123
                </ThemeElement>
              </div>
            </>
          )
        }

        if (paragraphCount === 3) {
          return (
            <>
              <Typography
                key={`content-${paragraphCount}`}
                as="p"
                variant="body-l"
                className={className}
              >
                {block?.text}
              </Typography>
              {renderAdInContent?.()}
            </>
          )
        }

        if (paragraphCount === 4) {
          if (relatedsOne && relatedsTwo) {
            return (
              <>
                <Typography
                  key={`content-${index}`}
                  as="p"
                  variant="body-l"
                  className={className}
                >
                  {block?.text}
                </Typography>
                <RelativePostLink
                  className="flex bg-mm-base-700"
                  type="prev"
                  href={`/story/${relatedsOne?.slug}`}
                >
                  上一篇
                </RelativePostLink>
                <RelativePostLink
                  className="flex bg-mm-base-700"
                  type="next"
                  href={`/story/${relatedsTwo?.slug}`}
                >
                  下一篇
                </RelativePostLink>
              </>
            )
          }
          if (relatedsOne) {
            return (
              <>
                <Typography
                  key={`content-${index}`}
                  as="p"
                  variant="body-l"
                  className={className}
                >
                  {block?.text}
                </Typography>
                <RelativePostLink
                  type="prev"
                  className="flex bg-mm-base-700"
                  href={`/story/${relatedsOne?.slug}`}
                >
                  上一篇
                </RelativePostLink>
              </>
            )
          }
          if (relatedsTwo) {
            return (
              <>
                <Typography
                  key={`content-${index}`}
                  as="p"
                  variant="body-l"
                  className={className}
                >
                  {block?.text}
                </Typography>
                <RelativePostLink
                  type="next"
                  className="flex bg-mm-base-700"
                  href={`/story/${relatedsTwo?.slug}`}
                >
                  下一篇
                </RelativePostLink>
              </>
            )
          }
        }

        return (
          <Typography
            key={`content-${paragraphCount}`}
            as="p"
            variant="body-l"
            className={className}
          >
            {block?.text}
          </Typography>
        )

      default:
        return null
    }
  })
}
