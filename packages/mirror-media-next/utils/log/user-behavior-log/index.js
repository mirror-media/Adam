import Bowser from 'bowser'
import { transformTimeDataIntoSlashFormat } from '../../index'

/**
 * @typedef {'pageview' | 'exit' | 'scroll-to-80%' | 'click'} EventType
 * @typedef {import('next/router').NextRouter['pathname']} Pathname
 *
 * @typedef {import('../../../context/membership').MemberType} MemberType
 *
 * @typedef {Object} Payload
 * @property {MemberType} memberType - type of member
 * @property {string} userEmail - member email
 * @property {string} firebaseId - member firebase id
 * @property {boolean} isMemberArticle - whether is member article. It will only be `true` if it is on story page and is a member article.
 * @property {string} writers - story writer
 */

/**
 * Generate information for user behavior log.
 * Caution: Since this function have use Web API, such as `window.location.href`, `window.navigator.userAgent`,
 * this function should be ONLY executed at client-side.
 * @param {EventType} eventType
 * @param {Pathname} pathname
 * @param {Payload} payload
 */
const generateUserBehaviorLogInfo = (
  eventType,
  pathname = '',
  payload = {
    memberType: 'not-member',
    userEmail: '',
    firebaseId: '',
    isMemberArticle: false,
    writers: '',
  }
) => {
  const {
    memberType = 'not-member',
    userEmail = '',
    firebaseId = '',
    isMemberArticle = false,
    writers,
  } = payload
  const userAgent = window?.navigator?.userAgent
  const triggerEvent = {
    'event-type': eventType,
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
    pageInfo['story-author'] = writers
  }
  return { triggerEvent, clientInfo, pageInfo }
}

function getBrowserInfo(userAgent = '') {
  if (!userAgent) {
    return {
      name: '',
      version: '',
    }
  }
  const browser = Bowser.getParser(userAgent)
  const browserInfo = browser.getBrowser()
  return browserInfo
}
function getDeviceInfo(userAgent = '') {
  if (!userAgent) {
    return {
      name: '',
      version: '',
    }
  }
  const browser = Bowser.getParser(userAgent)
  const deviceInfo = browser.getOS()
  return {
    name: deviceInfo?.name,
    version: deviceInfo?.version,
  }
}
/**
 *  Inspired by https://github.com/f2etw/detect-inapp
 */
function detectIsInApp(userAgent = '') {
  if (!userAgent) {
    return false
  }
  const rules = [
    'WebView',
    '(iPhone|iPod|iPad)(?!.*Safari/)',
    'Android.*(wv|.0.0.0)',
  ]
  const regex = new RegExp(`(${rules.join('|')})`, 'ig')
  return Boolean(userAgent.match(regex))
}
function getWindowSizeInfo() {
  return {
    width: document.documentElement.clientWidth || document.body.clientWidth,
    height: document.documentElement.clientHeight || document.body.clientHeight,
  }
}
/**
 *
 * @param {Pathname} pathname
 * @param {boolean} isMemberArticle
 * @returns
 */
function getFormattedPageType(pathname = '', isMemberArticle = false) {
  switch (true) {
    case pathname.startsWith('/') && pathname.length === 1:
      return 'index'

    case pathname.startsWith('/story/') && isMemberArticle:
      return 'premium-story'

    case pathname.startsWith('/story/') && !isMemberArticle:
      return 'story'

    case pathname.startsWith('/external/'):
      return 'external'

    case pathname.startsWith('/topic/'):
      return 'topic'

    case pathname.startsWith('/video/'):
      return 'video'

    case pathname.startsWith('/section/') ||
      pathname.startsWith('/premiumsection/') ||
      pathname.startsWith('/externals/'):
      return 'section'

    case pathname.startsWith('/category/') ||
      pathname.startsWith('/video_category/'):
      return 'category'

    default:
      return 'other'
  }
}

export { generateUserBehaviorLogInfo }
