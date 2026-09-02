import type { ReactNode } from 'react'

import { cn } from '@/components/cn'
import { Container } from '@/components/ui/container'

type ListPageMainProps = {
  children: ReactNode
  className?: string
}

export function ListPageMain({ children, className }: ListPageMainProps) {
  return (
    <Container
      as="main"
      className={cn('px-6 pb-10 md:pb-mm-6xl lg:px-10', className)}
    >
      {children}
    </Container>
  )
}
