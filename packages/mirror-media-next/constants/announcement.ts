const DEFAULT_ANNOUNCEMENT_SCOPE = 'all'

const ANNOUNCEMENT_SCOPE = {
  ALL: DEFAULT_ANNOUNCEMENT_SCOPE,
  PAPER_MAG: 'papermag',
} as const

type AnnouncementScopeValue =
  (typeof ANNOUNCEMENT_SCOPE)[keyof typeof ANNOUNCEMENT_SCOPE]

export { ANNOUNCEMENT_SCOPE, DEFAULT_ANNOUNCEMENT_SCOPE }
export type { AnnouncementScopeValue }
