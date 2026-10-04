import type { ComponentProps } from 'react'

import { cn } from '@/components/cn'

type LabelProps = ComponentProps<'label'>
const LabelPrimitive = 'label'

function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive
      className={cn(
        'flex items-center gap-mm-m font-mm-sans text-mm-body2 text-mm-neutral-700 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      data-slot="label"
      {...props}
    />
  )
}

export { Label }
export type { LabelProps }
