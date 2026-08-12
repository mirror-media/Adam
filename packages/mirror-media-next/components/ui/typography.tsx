import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import { cn } from '@/components/cn'

type TypographyVariant =
  | 'hero-title'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle'
  | 'body2'
  | 'body-l'
  | 'body-m'
  | 'body-s'
  | 'caption-l'
  | 'caption-s'

type TypographyProps<TElement extends ElementType> = {
  as?: TElement
  children: ReactNode
  variant?: TypographyVariant
} & Omit<ComponentPropsWithoutRef<TElement>, 'as' | 'children'>

const defaultElementByVariant = {
  'hero-title': 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle: 'p',
  body2: 'p',
  'body-l': 'p',
  'body-m': 'p',
  'body-s': 'p',
  'caption-l': 'span',
  'caption-s': 'span',
} satisfies Record<TypographyVariant, ElementType>

const typographyClassByVariant = {
  'hero-title': 'font-mm-sans text-mm-hero-title',
  h1: 'font-mm-sans text-mm-h1',
  h2: 'font-mm-sans text-mm-h2',
  h3: 'font-mm-sans text-mm-h3',
  h4: 'font-mm-sans text-mm-h4',
  h5: 'font-mm-sans text-mm-h5',
  h6: 'font-mm-sans text-mm-h6',
  subtitle: 'font-mm-sans text-mm-subtitle',
  body2: 'font-mm-sans text-mm-body2',
  'body-l': 'font-mm-body text-mm-body-l',
  'body-m': 'font-mm-body text-mm-body-m',
  'body-s': 'font-mm-body text-mm-body-s',
  'caption-l': 'font-mm-sans text-mm-caption-l',
  'caption-s': 'font-mm-sans text-mm-caption-s',
} satisfies Record<TypographyVariant, string>

export function Typography<TElement extends ElementType = 'p'>({
  as,
  variant = 'body-m',
  className,
  children,
  ...props
}: TypographyProps<TElement>) {
  const Component = as ?? defaultElementByVariant[variant]

  return (
    <Component
      className={cn(
        'm-0 text-mm-neutral-900',
        typographyClassByVariant[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export type { TypographyProps, TypographyVariant }
