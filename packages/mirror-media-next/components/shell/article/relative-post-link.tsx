import { Play } from 'lucide-react'

import { Link, LinkProps } from '@/components/ui'

type Props = LinkProps & {
  type?: 'prev' | 'next'
}

export function RelativePostLink({ children, type = 'prev', ...props }: Props) {
  return (
    <Link {...props}>
      {type === 'prev' && (
        <span>
          <Play />
        </span>
      )}
      {children}
      {type === 'next' && (
        <span>
          <Play className="rotate-180" />
        </span>
      )}
    </Link>
  )
}
