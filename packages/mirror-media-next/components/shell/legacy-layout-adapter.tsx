import type { ReactNode } from 'react'

import type {
  HeadersData,
  HeadersDataSection,
  ShellFlashNews,
  ShellSectionPosts,
  Topics,
} from '@/utils/api'

import type { SiteHeaderProps } from './header/site-header'
import { SiteHeader } from './header/site-header'
import { PageShell } from './page-shell'

type LegacyHeaderType = 'default' | 'default-with-flash-news'

type LegacyHeaderData = {
  activeNavigationSlug?: string
  flashNewsData?: ShellFlashNews[]
  navigationData?: HeadersDataSection[]
  sectionPostsData?: ShellSectionPosts
  sectionsData?: HeadersData
  topicsData?: Topics
}

type LegacyHeaderConfig = {
  data?: LegacyHeaderData
  type: LegacyHeaderType
}

type LegacyLayoutAdapterProps = {
  children: ReactNode
  header: LegacyHeaderConfig
  withFooter?: boolean
  withIdleTimeout?: boolean
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

function getShellHeaderData(header: LegacyHeaderConfig): SiteHeaderProps {
  const headerData = header.data ?? {}
  const navigationData =
    headerData.navigationData ??
    (headerData.sectionsData ?? []).filter(isHeaderSection)

  return {
    activeNavigationSlug: headerData.activeNavigationSlug,
    flashNewsData: headerData.flashNewsData ?? [],
    navigationData,
    sectionPostsData:
      headerData.sectionPostsData ?? getSectionPostsData(navigationData),
    topicsData: headerData.topicsData ?? [],
  }
}

function LegacyHeaderAdapter({ header }: LegacyHeaderAdapterProps) {
  // D18 resolves every non-AMP shared Header consumer to the same V4 SiteHeader.
  return <SiteHeader {...getShellHeaderData(header)} />
}

function LegacyLayoutAdapter({
  children,
  header,
  withFooter = true,
  withIdleTimeout = true,
}: LegacyLayoutAdapterProps) {
  return (
    <PageShell
      headerData={getShellHeaderData(header)}
      withFooter={withFooter}
      withIdleTimeout={withIdleTimeout}
    >
      {children}
    </PageShell>
  )
}

export { LegacyHeaderAdapter, LegacyLayoutAdapter }
export type {
  LegacyHeaderAdapterProps,
  LegacyHeaderConfig,
  LegacyLayoutAdapterProps,
}
