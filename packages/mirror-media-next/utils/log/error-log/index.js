import {
  getBrowserInfo,
  getDeviceInfo,
  detectIsInApp,
  getWindowSizeInfo,
  getFormattedPageType,
} from '../shared'
import {
  getClientSideOnlyError,
  isServer,
  transformTimeDataIntoSlashFormat,
} from '../../index'

/**
 *
 * @typedef {import('../../../context/membership').MemberType} MemberType
 *
 * @typedef {Object} Payload
 * @property {MemberType} [memberType] - type of member
 * @property {string} [userEmail] - member email
 * @property {string} [firebaseId] - member firebase id
 * @property {boolean} [isMemberArticle] - whether is member article. It will only be `true` if it is on story page and is a member article.
 */

/**
 * Generate information for error report.
 * Caution: Since this function have use Web API, such as `window.location.href`, `window.navigator.userAgent`,
 * this function should be ONLY executed at client-side.
 * @param {Error} error
 * @param {Payload} payload
 * @throws {Error}
 */
const generateErrorReportInfo = (
  error,
  payload = {
    memberType: 'not-member',
    userEmail: '',
    firebaseId: '',
    isMemberArticle: false,
  }
) => {
  if (isServer()) throw getClientSideOnlyError('generateErrorReportInfo')

  const pathname = window.location.pathname
  const {
    memberType = 'not-member',
    userEmail = '',
    firebaseId = '',
    isMemberArticle = false,
  } = payload
  const userAgent = window.navigator.userAgent
  const errorLog = {
    error,
    datetime: transformTimeDataIntoSlashFormat(new Date().toISOString(), true),
  }
  const clientInfo = {
    ip: '',
    userInfo: {
      'member-type': memberType,
      email: userEmail,
      'firebase-id': firebaseId,
    },
    browser: getBrowserInfo(userAgent),
    device: getDeviceInfo(userAgent),
    'is-in-app-browser': detectIsInApp(userAgent),
    'screen-size': getWindowSizeInfo(),
  }
  const pageInfo = {
    referral: document.referrer,
    'page-url': window.location.href,
    'page-type': getFormattedPageType(pathname, isMemberArticle),
  }

  if (pathname.startsWith('/story/')) {
    pageInfo['story-slug'] = pathname.split('/story/')?.[1] ?? ''
  }
  return { errorLog, clientInfo, pageInfo }
}

export { generateErrorReportInfo }
