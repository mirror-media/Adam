import type { ComponentProps } from 'react'
import { LoaderCircleIcon } from 'lucide-react'

import { cn } from '@/components/cn'

type SpinnerProps = ComponentProps<typeof LoaderCircleIcon>

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <LoaderCircleIcon
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      data-slot="spinner"
      role="status"
      {...props}
    />
  )
}

export { Spinner }
export type { SpinnerProps }
