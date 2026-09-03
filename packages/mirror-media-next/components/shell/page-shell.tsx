import type { ReactNode } from 'react'

import GDPRNotification from '@/components/gdpr'

import { BackToTop } from './back-to-top'
import { SiteFooter } from './footer/site-footer'
import type { SiteHeaderProps } from './header/site-header'
import { SiteHeader } from './header/site-header'
import { IdleTimeoutModal } from './idle-timeout-modal/idle-timeout-modal'

type PageShellProps = {
  children: ReactNode
  headerData: SiteHeaderProps
  pauseCarouselTickerOnIdle?: boolean
  withFooter?: boolean
  withIdleTimeout?: boolean
}

function PageShell({
  children,
  headerData,
  pauseCarouselTickerOnIdle = false,
  withFooter = true,
  withIdleTimeout = true,
}: PageShellProps) {
  return (
    <div
      className="flex min-h-dvh w-full flex-col"
      data-slot="application-shell"
    >
      <SiteHeader {...headerData} />
      {withIdleTimeout ? (
        <IdleTimeoutModal pauseCarouselTicker={pauseCarouselTickerOnIdle} />
      ) : undefined}
      <div
        className="flex min-w-0 flex-1 flex-col"
        data-slot="application-shell-content"
      >
        {children}
      </div>
      <GDPRNotification />
      {withFooter ? <SiteFooter /> : null}
      <BackToTop />
    </div>
  )
}

export { PageShell }
export type { PageShellProps }
