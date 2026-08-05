import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type ContainerSize = 'mobile' | 'tablet' | 'desktop' | 'md' | 'xl' | 'full'

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: ContainerSize
}

const sizeClassByName = {
  mobile: 'max-w-[375px]',
  tablet: 'max-w-[768px]',
  desktop: 'max-w-[1280px]',
  md: 'max-w-[768px]',
  xl: 'max-w-[1280px]',
  full: 'max-w-none',
} satisfies Record<ContainerSize, string>

export function Container({
  children,
  className,
  size = 'xl',
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-mm-xl md:px-mm-3xl',
        sizeClassByName[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export type { ContainerProps, ContainerSize }
