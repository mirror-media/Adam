import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/components/cn'

type ApplicationShellProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode
  footer: ReactNode
  globalModal?: ReactNode
  header: ReactNode
  privacyNotice?: ReactNode
}

function ApplicationShell({
  children,
  className,
  footer,
  globalModal,
  header,
  privacyNotice,
  ...props
}: ApplicationShellProps) {
  return (
    <div
      className={cn('flex min-h-dvh w-full flex-col', className)}
      data-slot="application-shell"
      {...props}
    >
      {header}
      {globalModal}
      <div
        className="flex min-w-0 flex-1 flex-col"
        data-slot="application-shell-content"
      >
        {children}
      </div>
      {privacyNotice}
      {footer}
    </div>
  )
}

export { ApplicationShell }
export type { ApplicationShellProps }
