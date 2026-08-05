import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type CardProps = HTMLAttributes<HTMLElement>

export function Card({ children, className, ...props }: CardProps) {
  return (
    <article
      className={cn(
        'rounded-mm-m border border-mm-neutral-300 bg-mm-neutral-0 p-mm-xl',
        className
      )}
      {...props}
    >
      {children}
    </article>
  )
}

export type { CardProps }
