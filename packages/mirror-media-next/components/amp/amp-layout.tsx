import type { ReactNode } from 'react'

import GDPRNotification from '../gdpr'
import CustomHead from '../shared/custom-head'

import IdleTimeoutModal from './idle-timeout-modal'

type AmpLayoutProps = {
  children: ReactNode
  head?: {
    description?: string
    imageUrl?: string
    skipCanonical?: boolean
    title?: string
  }
}

/**
 * AMP routes intentionally stay outside the Tailwind-based V4 shell import
 * graph. Their AMP Header and Footer remain unchanged; this layout preserves
 * the surrounding DOM order without importing the non-AMP V4 adapter.
 */
function AmpLayout({ children, head }: AmpLayoutProps) {
  return (
    <>
      <CustomHead
        description={head?.description}
        imageUrl={head?.imageUrl}
        skipCanonical={head?.skipCanonical}
        title={head?.title}
      />
      <IdleTimeoutModal />
      {children}
      <GDPRNotification />
    </>
  )
}

export default AmpLayout
