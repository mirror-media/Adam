import * as React from 'react'

import { cn } from '@/components/cn'

type SkeletonProps = React.ComponentProps<'div'>

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-mm-s bg-mm-neutral-200', className)}
      data-slot="skeleton"
      {...props}
    />
  )
}

export { Skeleton }
export type { SkeletonProps }
