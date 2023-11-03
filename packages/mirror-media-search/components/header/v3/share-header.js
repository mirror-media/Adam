//TODO: add jsDoc of param  on component `Share-Header`

import Header from './header'

/**
 * @typedef {import('../header').Sections} NormalSectionsData
 * @typedef {import('../header').Topics} TopicsData
 * @typedef {import('../flash-news').FlashNews[]} FlashNewsData
 * @typedef {import('../premium-header').PremiumHeaderSections} PremiumSectionsData
 * @typedef {import('../premium-header').H2AndH3Block[]}  H2AndH3Blocks
 */

/**
 * @typedef {Object} DefaultHeaderData
 * @property {NormalSectionsData} [sectionsData]
 * @property {TopicsData} [topicsData]
 */

/**
 * @typedef {Object} HeaderData
 * @property {DefaultHeaderData['sectionsData']} sectionsData
 * @property {DefaultHeaderData['topicsData']} [topicsData]
 *
 *
 * @typedef {'default' | 'empty' } HeaderType
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
 * Use factory function to support future header type
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
