const DEFAULT_ANNOUNCEMENT_SCOPE = 'all'

const ANNOUCEMENT_SCOPE = /** @type {const} */ ({
  ALL: DEFAULT_ANNOUNCEMENT_SCOPE,
  PAPER_MAG: 'papermag',
})

/**
 * @typedef {ANNOUCEMENT_SCOPE[keyof typeof ANNOUCEMENT_SCOPE]} AnnouncementScopeValue
 */

export { DEFAULT_ANNOUNCEMENT_SCOPE, ANNOUCEMENT_SCOPE }
