import { MICRO_AD_UNITS, POP_IN_IDS } from '../constants/ads'
import { SECTION_IDS } from '../constants/index'

type MicroAdType = 'HOME' | 'LISTING' | 'STORY'
type Device = 'PC' | 'MB' | 'RWD'
type SectionWithName = {
  name?: string
}

/**
 * Determining whether to insert a `Micro` advertisement after a specific post index.
 */
const needInsertMicroAdAfter = (index = 0): boolean => {
  if (typeof index !== 'number') {
    console.error(
      `The value for 'index' is not of the correct data type 'number'. Please check the data type of the value being passed.`
    )
    return false
  }

  return index === 1 || index === 3 || index === 5
}

// Determining which Micro advertisement ID to take based on the `index`.
const getMicroAdUnitId = (
  index = 0,
  microAdType: MicroAdType = 'LISTING',
  device: Device = 'RWD'
): string | null => {
  let unitId: string | null = null

  if (typeof index !== 'number') {
    console.error(
      `The value for 'index' is not of the correct data type 'number'. Please check the data type of the value being passed.`
    )
    return null
  }

  if (microAdType === 'LISTING') {
    const unitIndex = Math.floor((index - 1) / 2)
    const unitsByDevice = MICRO_AD_UNITS.LISTING as Partial<
      Record<Device, typeof MICRO_AD_UNITS.LISTING.RWD>
    >
    unitId = unitsByDevice[device]?.[unitIndex]?.id || null
  } else if (microAdType === 'HOME') {
    const unitIndex = Math.floor((index - 1) / 2)
    const unitsByDevice = MICRO_AD_UNITS.HOME as Partial<
      Record<Device, typeof MICRO_AD_UNITS.HOME.PC>
    >
    unitId = unitsByDevice[device]?.[unitIndex]?.id || null
  }

  return unitId
}

/**
 * Returns the GPT pageKey associated with partner's showOnIndex.
 * The GPT pageKey associated with the partner showOnIndex.
 * Returns 'SECTION_IDS.news' if partnerShowOnIndex is valid, otherwise returns 'other'.
 */
function getPageKeyByPartnerShowOnIndex(partnerShowOnIndex: boolean): string {
  return partnerShowOnIndex
    ? (SECTION_IDS['news'] ?? 'other')
    : (SECTION_IDS['life'] ?? 'other')
}

// Returns the GPT pageKey associated with section's slug.
const getSectionGPTPageKey = (sectionSlug: string): string => {
  if (!sectionSlug || typeof sectionSlug !== 'string') {
    return 'other'
  }

  let GptPageKey

  //if sectionSlug is `論壇(mirrorcolumn)` or `新聞深探(timesquare)`, use the `culture` ad unit.
  const invalidSections = ['mirrorcolumn', 'timesquare']

  if (invalidSections.includes(sectionSlug)) {
    GptPageKey = SECTION_IDS['culture']
  } else if (Object.prototype.hasOwnProperty.call(SECTION_IDS, sectionSlug)) {
    GptPageKey = SECTION_IDS[sectionSlug as keyof typeof SECTION_IDS]
  } else {
    //if SECTION_IDS doesn't include `sectionSlug` ad units, use `other` ad units
    GptPageKey = 'other'
  }

  return GptPageKey
}

/**
 * Determining whether to insert a `PopIn` advertisement after a specific post index.
 */
const needInsertPopInAdAfter = (index = 0): boolean => {
  if (typeof index !== 'number') {
    console.error(
      `The value for 'index' is not of the correct data type 'number'. Please check the data type of the value being passed.`
    )
    return false
  }

  return index === 1 || index === 2
}

// Determining which PopIn advertisement ID to take based on the `index`.
const getPopInId = (index = 0): string | null => {
  if (typeof index !== 'number') {
    console.error(
      `The value for 'index' is not of the correct data type 'number'. Please check the data type of the value being passed.`
    )
    return null
  }

  if (index === 1) {
    return POP_IN_IDS.HOT[0]
  } else if (index === 2) {
    return POP_IN_IDS.HOT[1]
  }

  return null
}

/**
 * TODO: the logic of selecting amp-gpt-ad unit is different from gpt-ad in normal page.
 * Should refactor to prevent logic inconsistent.
 *
 * Retrieves the data slot section for a given section name.
 */
function getAmpGptDataSlotSection(
  section: SectionWithName | null | undefined,
  isMemberArticle: boolean
): string {
  if (isMemberArticle) {
    return 'member'
  }
  const name = section?.name

  switch (true) {
    case name?.includes('時事'):
      return 'news'
    case name?.includes('娛樂'):
      return 'ent'
    case name?.includes('財經理財'):
      return 'fin'
    case name?.includes('人物'):
      return 'peo'
    case name?.includes('國際'):
      return 'int'
    case name?.includes('瑪法達'):
      return 'mafa'
    case name?.includes('文化'):
      return 'cul'
    case name?.includes('汽車鐘錶'):
      return 'wat'
    case name?.includes('美食旅遊'):
      return 'tra'
    case name?.includes('生活'):
      return 'life'
    default:
      return 'oth'
  }
}

export {
  getAmpGptDataSlotSection,
  getMicroAdUnitId,
  getPageKeyByPartnerShowOnIndex,
  getPopInId,
  getSectionGPTPageKey,
  needInsertMicroAdAfter,
  needInsertPopInAdAfter,
}
export type { Device, MicroAdType }
