import type { ComponentPropsWithoutRef } from 'react'
import NextLink from 'next/link'

import { cn } from '@/lib/utils'

type LinkVariant = 'default' | 'muted' | 'button'

type LinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
  variant?: LinkVariant
}

const variantClassByName = {
  default:
    'text-mm-base-700 underline-offset-4 hover:text-mm-second-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-500',
  muted:
    'text-mm-neutral-600 underline-offset-4 hover:text-mm-base-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-500',
  button:
    'inline-flex h-8 min-w-[100px] items-center justify-center rounded-mm-s bg-mm-base-700 px-mm-l font-mm-sans text-mm-subtitle text-mm-neutral-0 transition-colors hover:bg-mm-base-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mm-second-500',
} satisfies Record<LinkVariant, string>

export function Link({
  children,
  className,
  variant = 'default',
  ...props
}: LinkProps) {
  return (
    <NextLink className={cn(variantClassByName[variant], className)} {...props}>
      {children}
    </NextLink>
  )
}

export type { LinkProps, LinkVariant }
