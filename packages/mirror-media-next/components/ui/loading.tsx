import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type LoadingProps = HTMLAttributes<HTMLDivElement> & {
  label?: string
}

export function Loading({ className, label, ...props }: LoadingProps) {
  return (
    <div
      aria-label={label ?? 'Loading'}
      className={cn(
        'inline-flex items-center gap-mm-m text-mm-neutral-600',
        className
      )}
      role="status"
      {...props}
    >
      <span className="h-mm-xl w-mm-xl animate-spin rounded-mm-full border-2 border-mm-neutral-300 border-t-mm-base-500" />
      {label ? (
        <span className="font-mm-sans text-mm-body2">{label}</span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  )
}

export type { LoadingProps }
