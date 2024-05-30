import Bowser from 'bowser'
import errors from '@twreporter/errors'
import { ApolloError } from '@apollo/client'

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
 * @param {string} pathname
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

/**
 * @param {Error | import('axios').AxiosError} axiosErrors
 * @param {string} errorMessage
 * @param {Record<string, any> | undefined} traceObject
 */
const logAxiosError = (axiosErrors, errorMessage, traceObject) => {
  const annotatingError = errors.helpers.wrap(
    axiosErrors,
    'UnhandledError',
    errorMessage
  )

  console.error(
    JSON.stringify({
      severity: 'ERROR',
      message: errors.helpers.printAll(
        annotatingError,
        {
          withStack: true,
          withPayload: true,
        },
        0,
        0
      ),
      debugPayload: {
        axiosErrors,
      },
      ...(traceObject ?? {}),
    })
  )
}

/**
 * @param {Error | import('@apollo/client/errors').ApolloError} gqlErrors
 * @param {string} errorMessage
 * @param {Record<string, any> | undefined} traceObject
 */
const logGqlError = (gqlErrors, errorMessage, traceObject) => {
  const annotatingError = errors.helpers.wrap(
    gqlErrors,
    'UnhandledError',
    errorMessage
  )

  if (gqlErrors instanceof ApolloError) {
    const { graphQLErrors, clientErrors, networkError } = gqlErrors
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(
          annotatingError,
          {
            withStack: true,
            withPayload: true,
          },
          0,
          0
        ),
        debugPayload: {
          graphQLErrors,
          clientErrors,
          networkError,
        },
        ...(traceObject ?? {}),
      })
    )
  } else {
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(
          annotatingError,
          {
            withStack: true,
            withPayload: true,
          },
          0,
          0
        ),
        debugPayload: {
          gqlErrors,
        },
        ...(traceObject ?? {}),
      })
    )
  }
}

export {
  getBrowserInfo,
  getDeviceInfo,
  detectIsInApp,
  getWindowSizeInfo,
  getFormattedPageType,
  logAxiosError,
  logGqlError,
}
