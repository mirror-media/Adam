import type { RawDraftContentState } from 'draft-js'

import { cn } from '@/components/cn'
import { Link, Typography } from '@/components/ui'
import { SITE_URL } from '@/config/index.mjs'

/**
 * CMS-authored content always links to the production domain regardless of
 * which environment is currently serving the page, so this checks against
 * the `mirrormedia.mg` domain family (not just the env-varying `SITE_URL`,
 * which would otherwise misclassify production links as external when
 * viewed on dev/staging). `SITE_URL` is also checked so relative paths and
 * same-origin absolute urls resolve correctly for the current environment
 * (e.g. a `localhost` link while running `pnpm dev`).
 */
function isInternalUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url, `https://${SITE_URL}`)
    return (
      hostname === SITE_URL ||
      hostname === 'mirrormedia.mg' ||
      hostname.endsWith('.mirrormedia.mg')
    )
  } catch {
    return false
  }
}

/**
 * Renders a block's text with inline `LINK` entities (draft-js
 * `entityRanges`) turned into actual links, since `entityRanges` only carry
 * offset/length into `block.text` and the entity data (e.g. the url) lives
 * in `entityMap` keyed by `entityRanges[].key`.
 */
export function renderTextWithLinks(
  block: RawDraftContentState['blocks'][0],
  entityMap: RawDraftContentState['entityMap']
): React.ReactNode {
  const linkRanges = block.entityRanges
    .filter((range) => entityMap[range.key]?.type === 'LINK')
    .sort((a, b) => a.offset - b.offset)

  if (linkRanges.length === 0) return block.text

  const nodes: React.ReactNode[] = []
  let cursor = 0

  linkRanges.forEach((range, index) => {
    if (range.offset > cursor) {
      nodes.push(block.text.slice(cursor, range.offset))
    }
    const url = entityMap[range.key].data.url
    const isInternalLink = isInternalUrl(url)
    const href = isInternalLink ? `${url}?from=referral_bottom` : url

    nodes.push(
      <Link
        key={`link-${index}`}
        href={href}
        target="_blank"
        rel={isInternalLink ? 'noopener' : 'noreferrer noopener'}
        className="font-mm-body text-mm-body-l"
      >
        {block.text.slice(range.offset, range.offset + range.length)}
      </Link>
    )

    cursor = range.offset + range.length
  })

  if (cursor < block.text.length) {
    nodes.push(block.text.slice(cursor))
  }

  return nodes
}

type BlocksProps = {
  contents: RawDraftContentState
  className?: string
  renderPostInContent?: (
    block: RawDraftContentState['blocks'][0],
    paragraphCount: number
  ) => React.ReactNode
  renderAdInContent?: () => React.ReactNode
}

const listTagByBlockType = {
  'unordered-list-item': 'ul',
  'ordered-list-item': 'ol',
} as const

type ListBlockType = keyof typeof listTagByBlockType

function isListBlockType(type: string | undefined): type is ListBlockType {
  return type === 'unordered-list-item' || type === 'ordered-list-item'
}

export function Blocks({
  contents,
  className,
  renderPostInContent,
}: BlocksProps) {
  let paragraphCount = 0
  let headingCount = 0
  const nodes: React.ReactNode[] = []
  const { blocks, entityMap } = contents

  let index = 0
  while (index < blocks.length) {
    const block = blocks[index]

    if (isListBlockType(block?.type)) {
      const listType = block.type
      const listStartIndex = index
      const items: React.ReactNode[] = []

      while (index < blocks.length && blocks[index]?.type === listType) {
        items.push(
          <Typography key={`list-item-${index}`} as="li" variant="body-l">
            {renderTextWithLinks(blocks[index], entityMap)}
          </Typography>
        )
        index = index + 1
      }

      const ListTag = listTagByBlockType[listType]
      nodes.push(
        <ListTag
          key={`list-${listStartIndex}`}
          className={cn(
            listType === 'ordered-list-item' ? 'list-decimal' : 'list-disc',
            'space-y-1 pl-5',
            className
          )}
        >
          {items}
        </ListTag>
      )
      continue
    }

    switch (block?.type) {
      case 'header-two':
        headingCount = headingCount + 1
        nodes.push(
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
        break
      case 'header-three':
        headingCount = headingCount + 1
        nodes.push(
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
        break
      case 'header-four':
        headingCount = headingCount + 1
        nodes.push(
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
        break
      case 'header-five':
        headingCount = headingCount + 1
        nodes.push(
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
        break
      case 'header-six':
        headingCount = headingCount + 1
        nodes.push(
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
        break
      case 'atomic':
        nodes.push(
          block.entityRanges.map((entityRange) => {
            const entity = entityMap[entityRange.key]

            if (entity.type === 'image') {
              return (
                <figure key={`content-${index}`} className={className}>
                  <picture className="block">
                    <img
                      srcSet={
                        entity.data.resized
                          ? Object.entries(entity.data.resized)
                              .filter(
                                ([key, value]) =>
                                  !['original', '__typename'].includes(key) &&
                                  Boolean(value)
                              )
                              .sort(
                                (a, b) =>
                                  parseInt(a[0].replace('w', '')) -
                                  parseInt(b[0].replace('w', ''))
                              )
                              .map(
                                ([key, value]) =>
                                  `${value} ${key.replace('w', '')}w`
                              )
                              .join(',')
                          : undefined
                      }
                      sizes="(min-width: 768px) 50vw, 100vw"
                      src={
                        entity.data.resized?.w2400 ??
                        entity.data.resized?.original
                      }
                      alt={entity.data.desc ?? ''}
                      width="100%"
                      height="auto"
                      loading="lazy"
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
        )
        break
      case 'unstyled':
        paragraphCount = paragraphCount + 1
        nodes.push(renderPostInContent?.(block, paragraphCount))
        break
      default:
        nodes.push(null)
    }
    index = index + 1
  }

  return nodes
}
