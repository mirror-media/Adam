import type { ComponentPropsWithoutRef } from 'react'
import NextLink from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/components/cn'

// Use cn(linkVariants(...), className) when external classes may override a variant.
const linkVariants = cva(
  'font-mm-sans underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-neutral-900 focus-visible:outline-solid',
  {
    variants: {
      variant: {
        default:
          'text-mm-body2 text-mm-base-700 hover:text-mm-second-600 hover:underline',
        muted:
          'text-mm-body2 text-mm-neutral-600 hover:text-mm-base-700 hover:underline',
        plain: 'hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type LinkVariant = NonNullable<VariantProps<typeof linkVariants>['variant']>

type LinkProps = ComponentPropsWithoutRef<typeof NextLink> &
  VariantProps<typeof linkVariants>

export function Link({
  children,
  className,
  variant = 'default',
  ...props
}: LinkProps) {
  return (
    <NextLink className={cn(linkVariants({ variant }), className)} {...props}>
      {children}
    </NextLink>
  )
}

export { linkVariants }
export type { LinkProps, LinkVariant }
