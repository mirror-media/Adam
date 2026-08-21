import type { ReactNode } from 'react'

import type {
  HeadersData,
  HeadersDataSection,
  ShellFlashNews,
  ShellSectionPosts,
  Topics,
} from '@/utils/api'

import { SiteFooter } from './footer/site-footer'
import { SiteHeader } from './header/site-header'

type LegacyHeaderType = 'default' | 'default-with-flash-news' | 'empty'

type LegacyHeaderData = {
  activeNavigationSlug?: string
  flashNewsData?: ShellFlashNews[]
  sectionsData?: HeadersData
  topicsData?: Topics
}

type LegacyHeaderConfig = {
  data?: LegacyHeaderData
  type: LegacyHeaderType
}

type LegacyFooterConfig = {
  type: 'default' | 'empty'
}

type LegacyLayoutAdapterProps = {
  children: ReactNode
  footer: LegacyFooterConfig
  globalModal?: ReactNode
  header: LegacyHeaderConfig
  privacyNotice?: ReactNode
}

type LegacyHeaderAdapterProps = {
  header: LegacyHeaderConfig
}

function isHeaderSection(
  item: HeadersData[number]
): item is HeadersDataSection {
  return item.type === 'section'
}

function getSectionPostsData(
  navigationData: HeadersDataSection[]
): ShellSectionPosts {
  return Object.fromEntries(
    navigationData.map((section) => [section.slug, section.posts ?? []])
  )
}

function LegacyHeaderAdapter({ header }: LegacyHeaderAdapterProps) {
  const headerData = header.data ?? {}

  if (header.type === 'empty') {
    return null
  }

  const navigationData = (headerData.sectionsData ?? []).filter(isHeaderSection)

  // D18 resolves every non-AMP shared Header consumer to the same V4 SiteHeader.
  return (
    <SiteHeader
      activeNavigationSlug={headerData.activeNavigationSlug}
      flashNewsData={headerData.flashNewsData}
      navigationData={navigationData}
      sectionPostsData={getSectionPostsData(navigationData)}
      topicsData={headerData.topicsData ?? []}
    />
  )
}

function LegacyLayoutAdapter({
  children,
  footer,
  globalModal,
  header,
  privacyNotice,
}: LegacyLayoutAdapterProps) {
  const hasHeader = header.type !== 'empty'
  const hasFooter = footer.type !== 'empty'

  // Preserve the V3 Layout's bare DOM flow while replacing only its shared
  // Header and Footer. New route bodies can adopt ApplicationShell directly.
  return (
    <>
      {hasHeader ? <LegacyHeaderAdapter header={header} /> : null}
      {globalModal}
      {children}
      {privacyNotice}
      {hasFooter ? <SiteFooter /> : null}
    </>
  )
}

export { LegacyHeaderAdapter, LegacyLayoutAdapter }
export type {
  LegacyHeaderAdapterProps,
  LegacyHeaderConfig,
  LegacyLayoutAdapterProps,
}
