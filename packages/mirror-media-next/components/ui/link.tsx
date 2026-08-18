import type { ComponentPropsWithoutRef } from 'react'
import NextLink from 'next/link'

import { cn } from '@/components/cn'

type LinkVariant = 'default' | 'muted' | 'button'

type LinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
  variant?: LinkVariant
}

const baseLinkClass =
  'font-mm-sans underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-500'

const variantClassByName = {
  default:
    'text-mm-body2 text-mm-base-700 hover:text-mm-second-600 hover:underline',
  muted:
    'text-mm-body2 text-mm-neutral-600 hover:text-mm-base-700 hover:underline',
  button:
    'inline-flex h-8 min-w-25 items-center justify-center rounded-mm-s bg-mm-base-700 px-mm-l text-mm-subtitle text-mm-neutral-0 transition-colors hover:bg-mm-base-500',
} satisfies Record<LinkVariant, string>

export function Link({
  children,
  className,
  variant = 'default',
  ...props
}: LinkProps) {
  return (
    <NextLink
      className={cn(baseLinkClass, variantClassByName[variant], className)}
      {...props}
    >
      {children}
    </NextLink>
  )
}

export type { LinkProps, LinkVariant }
