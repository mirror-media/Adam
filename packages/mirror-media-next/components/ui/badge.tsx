import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/components/cn'

const badgeVariants = cva(
  'inline-flex h-6 w-fit shrink-0 items-center justify-center gap-mm-s overflow-hidden rounded-mm-full border px-mm-l py-mm-s font-mm-sans text-mm-caption-s whitespace-nowrap transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-neutral-900 focus-visible:outline-solid [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        outline:
          'border-mm-base-500 bg-mm-neutral-0 text-mm-base-500 hover:bg-mm-base-100',
        'outline-muted':
          'border-mm-base-500 bg-mm-neutral-100 text-mm-base-500 hover:bg-mm-neutral-100',
        'solid-base':
          'border-mm-base-700 bg-mm-base-700 text-mm-neutral-0 hover:bg-mm-base-600',
        'solid-second':
          'border-mm-second-700 bg-mm-second-700 text-mm-neutral-0 hover:bg-mm-second-600',
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  }
)

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

type BadgeProps = useRender.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants>

function Badge({
  className,
  variant = 'outline',
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  })
}

export { Badge, badgeVariants }
export type { BadgeProps, BadgeVariant }
