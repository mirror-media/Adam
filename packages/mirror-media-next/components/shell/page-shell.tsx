import type { ReactNode } from 'react'

import GDPRNotification from '@/components/gdpr'
import IdleTimeoutModal from '@/components/idle-modal/idle-timeout-modal'

import { ApplicationShell } from './application-shell'
import { SiteFooter } from './footer/site-footer'
import type { SiteHeaderProps } from './header/site-header'
import { SiteHeader } from './header/site-header'

type PageShellProps = {
  children: ReactNode
  headerData: SiteHeaderProps
  withIdleTimeout?: boolean
}

function PageShell({
  children,
  headerData,
  withIdleTimeout = true,
}: PageShellProps) {
  return (
    <ApplicationShell
      footer={<SiteFooter />}
      globalModal={withIdleTimeout ? <IdleTimeoutModal /> : undefined}
      header={<SiteHeader {...headerData} />}
      privacyNotice={<GDPRNotification />}
    >
      {children}
    </ApplicationShell>
  )
}

export { PageShell }
export type { PageShellProps }
