import type { ReactNode } from 'react'

import { cn } from '@/components/cn'
import { Container } from '@/components/ui/container'

type ListPageMainProps = {
  children: ReactNode
  className?: string
}

/**
 * 列表頁 `<main>` 的共用外框。
 *
 * `md:px-10` 不能刪：`Container` 預設是 `px-mm-xl md:px-mm-3xl`，少了它 md 以上會退回 24px。
 */
export function ListPageMain({ children, className }: ListPageMainProps) {
  return (
    <Container
      as="main"
      className={cn('px-10 pb-10 md:px-10 md:pb-mm-6xl', className)}
    >
      {children}
    </Container>
  )
}
