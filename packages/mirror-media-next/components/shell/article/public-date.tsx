import type { HTMLAttributes } from 'react'
import dayjs from 'dayjs'

import { Typography } from '@/components/ui'
import type { StoryPost } from '@/modules/story/story-types'

type Props = Partial<Pick<StoryPost, 'publishedDate' | 'updatedAt'>> &
  HTMLAttributes<HTMLDivElement>

export function PublicDate({ publishedDate, updatedAt, ...props }: Props) {
  if (publishedDate) {
    const publishedDateStr = dayjs(publishedDate).format('YYYY/MM/DD HH:mm')

    if (updatedAt) {
      const updatedAtStr = dayjs(updatedAt).format('YYYY/MM/DD HH:mm')

      return (
        <div {...props}>
          <Typography
            as="time"
            variant="caption-l"
            className="text-[#a1a1a1]"
            dateTime={publishedDate}
          >
            {publishedDateStr}
          </Typography>
          <span className="ml-2">
            <Typography className="text-[#a1a1a1]" variant="caption-l">
              最後更新{' '}
            </Typography>
            <Typography
              as="time"
              className="text-[#a1a1a1]"
              variant="caption-l"
              dateTime={updatedAt}
            >
              {updatedAtStr}
            </Typography>
          </span>
        </div>
      )
    }

    return (
      <div {...props}>
        <time dateTime={publishedDate}>{publishedDateStr}</time>
      </div>
    )
  }

  return null
}
