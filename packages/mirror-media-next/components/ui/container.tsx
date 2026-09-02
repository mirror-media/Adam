import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import { cn } from '@/components/cn'

type ContainerSize = 'mobile' | 'tablet' | 'desktop' | 'full'

type ContainerProps<TElement extends ElementType> = {
  as?: TElement
  children?: ReactNode
  size?: ContainerSize
} & Omit<ComponentPropsWithoutRef<TElement>, 'as' | 'children'>

const sizeClassByName = {
  mobile: 'max-w-[375px]',
  tablet: 'max-w-[768px]',
  desktop: 'max-w-[1280px]',
  full: 'max-w-none',
} satisfies Record<ContainerSize, string>

export function Container<TElement extends ElementType = 'div'>({
  as,
  children,
  className,
  size = 'desktop',
  ...props
}: ContainerProps<TElement>) {
  const Component = as ?? 'div'

  return (
    <Component
      className={cn(
        'mx-auto w-full px-mm-xl md:px-mm-3xl',
        sizeClassByName[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export type { ContainerProps, ContainerSize }
