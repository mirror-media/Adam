import type { ReactNode } from 'react'

import GDPRNotification from '@/components/gdpr'

import { ApplicationShell } from './application-shell'
import { BackToTop } from './back-to-top'
import { SiteFooter } from './footer/site-footer'
import type { SiteHeaderProps } from './header/site-header'
import { SiteHeader } from './header/site-header'
import { IdleTimeoutModal } from './idle-timeout-modal/idle-timeout-modal'

type PageShellProps = {
  children: ReactNode
  headerData: SiteHeaderProps
  pauseCarouselTickerOnIdle?: boolean
  withIdleTimeout?: boolean
}

function PageShell({
  children,
  headerData,
  pauseCarouselTickerOnIdle = false,
  withIdleTimeout = true,
}: PageShellProps) {
  return (
    <ApplicationShell
      floatingAction={<BackToTop />}
      footer={<SiteFooter />}
      globalModal={
        withIdleTimeout ? (
          <IdleTimeoutModal pauseCarouselTicker={pauseCarouselTickerOnIdle} />
        ) : undefined
      }
      header={<SiteHeader {...headerData} />}
      privacyNotice={<GDPRNotification />}
    >
      {children}
    </ApplicationShell>
  )
}

export { PageShell }
export type { PageShellProps }
