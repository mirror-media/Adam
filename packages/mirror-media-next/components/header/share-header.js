//TODO: add jsDoc of param  on component `Share-Header`

import Header from './normal/header'
import PremiumHeader from './premium/premium-header'
import FlashNews from './shared/flash-news'

/**
 * @typedef {import('./normal/header').Sections} NormalSectionsData
 * @typedef {import('./normal/header').Topics} TopicsData
 * @typedef {import('./shared/flash-news').FlashNews[]} FlashNewsData
 * @typedef {import('./premium/premium-header').PremiumHeaderSections} PremiumSectionsData
 * @typedef {import('./premium/premium-header').H2AndH3Block[]}  H2AndH3Blocks
 */

/**
 * @typedef {Object} DefaultHeaderData
 * @property {NormalSectionsData} [sectionsData]
 * @property {TopicsData} [topicsData]
 *
 *
 * @typedef {Object} DefaultHeaderWithFlashNewsData
 * @property {Object} [sectionsData]
 * @property {TopicsData} [topicsData]
 * @property {FlashNewsData} [flashNewsData]
 *
 *
 * @typedef {Object} PremiumHeaderData
 * @property {PremiumSectionsData} [sectionsData]
 *
 * @typedef {Object} PremiumHeaderWithSubtitleNavigatorData
 * @property {PremiumSectionsData} [sectionsData]
 * @property {H2AndH3Blocks} [h2AndH3Block]
 *
 */

/**
 * @typedef {Object} HeaderData
 * @property {DefaultHeaderData['sectionsData'] | PremiumHeaderData['sectionsData']} sectionsData
 * @property {DefaultHeaderData['topicsData']} [topicsData]
 * @property {DefaultHeaderWithFlashNewsData['flashNewsData']} [flashNewsData]
 * @property {PremiumHeaderWithSubtitleNavigatorData['h2AndH3Block']} [h2AndH3Block]
 *
 *
 * @typedef {'default' | 'default-with-flash-news' | 'premium' | 'premium-with-subtitle-navigator' | 'empty' } HeaderType
 */

/**
 * @param {DefaultHeaderData} headerData
 */
const getDefaultHeader = (headerData) => {
  const { sectionsData, topicsData } = headerData
  if (!sectionsData || !sectionsData.length) {
    console.warn('There is no sections data for header of default page layout')
  } else if (!topicsData || !topicsData.length) {
    console.warn('There is no topics data for header of default page layout')
  }

  return <Header sectionsData={sectionsData} topicsData={topicsData} />
}
/**
 * @param {DefaultHeaderWithFlashNewsData} headerData
 */
const getDefaultHeaderWithFlashNews = (headerData) => {
  const { sectionsData, topicsData, flashNewsData } = headerData
  if (!sectionsData || !sectionsData.length) {
    console.warn('There is no sections data for header of default page layout')
  } else if (!topicsData || !topicsData.length) {
    console.warn('There is no topics data for header of default page layout')
  } else if (!flashNewsData || !flashNewsData.length) {
    console.warn(
      'There is no flash news data for header of default page layout'
    )
  }
  const flashNews = flashNewsData
  return (
    <Header sectionsData={sectionsData} topicsData={topicsData}>
      <FlashNews flashNews={flashNews} />
    </Header>
  )
}
/**
 * @param {PremiumHeaderData} headerData
 */
const getPremiumHeader = (headerData) => {
  const { sectionsData } = headerData
  if (!sectionsData || !sectionsData.length) {
    console.warn('There is no sections data for header of premium page layout')
  }

  return <PremiumHeader premiumHeaderData={{ sections: sectionsData }} />
}
/**
 * @param {PremiumHeaderWithSubtitleNavigatorData} headerData
 */
const getPremiumHeaderWithSubtitleNavigator = (headerData) => {
  const { sectionsData, h2AndH3Block } = headerData
  if (!sectionsData || !sectionsData.length) {
    console.warn('There is no sections data for header of premium page layout')
  }

  return (
    <PremiumHeader
      premiumHeaderData={{ sections: sectionsData }}
      h2AndH3Block={h2AndH3Block}
      shouldShowSubtitleNavigator={true}
    />
  )
}

/**
 *
 * @param {Object} props
 * @param {HeaderType} props.pageLayoutType
 * @param {HeaderData} [props.headerData]
 * @param {JSX.Element | null} [props.children]
 * @returns {JSX.Element}
 */
export default function ShareHeader({
  pageLayoutType = 'default',
  headerData = { sectionsData: [] },
}) {
  const getHeaderJsx = () => {
    switch (pageLayoutType) {
      case 'default': {
        const header = getDefaultHeader(headerData)
        return header
      }
      case 'default-with-flash-news': {
        const header = getDefaultHeaderWithFlashNews(headerData)
        return header
      }
      case 'premium': {
        const header = getPremiumHeader(headerData)
        return header
      }
      case 'premium-with-subtitle-navigator': {
        const header = getPremiumHeaderWithSubtitleNavigator(headerData)
        return header
      }
      case 'empty':
        return <></>
      default: {
        const header = getDefaultHeader(headerData)
        return header
      }
    }
  }

  const headerJsx = getHeaderJsx()

  return headerJsx
}
