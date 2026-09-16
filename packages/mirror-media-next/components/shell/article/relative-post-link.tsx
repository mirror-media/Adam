import { Play } from 'lucide-react'

import { cn } from '@/components/cn'
import { Link, LinkProps } from '@/components/ui'

type Props = LinkProps & {
  type?: 'prev' | 'next'
}

export function RelativePostLink({ children, type = 'prev', ...props }: Props) {
  return (
    <Link {...props}>
      {type === 'prev' && (
        <span className="inline-flex w-4.5 items-center bg-neutral-400">
          <Play
            className="scale-x-75 rotate-180"
            fill="#D9D9D9"
            stroke="none"
          />
        </span>
      )}
      <span
        className={cn('py-2', {
          'mr-3 ml-1 pl-5 md:mr-auto': type === 'prev',
          'mr-1 ml-3 pr-5 md:ml-auto': type === 'next',
        })}
      >
        {children}
      </span>
      {type === 'next' && (
        <span className="inline-flex w-4.5 items-center bg-neutral-400">
          <Play className="scale-x-75" fill="#D9D9D9" stroke="none" />
        </span>
      )}
    </Link>
  )
}
