/**
 * @typedef {import('next').GetServerSidePropsContext['res']} Res
 */

/**
 * @typedef {import('next').GetServerSidePropsContext['req']['url']} PageUrl
 */

/**
 * @typedef {Object} CacheSetting
 * @property {'max-age' | 'no-store' | 'no-cache'} cachePolicy
 * - Policy of `Cache-Control` want to set. Currently accept three type of value: 'no-store', 'no-cache', and 'max-age'.
 * - If `cachePolicy` is 'no-store' or 'no-cache', value of Cache-Control would be set as 'no-store' or 'no-cache'.
 * - If `cachePolicy` is 'max-age', value of Cache-Control would be set as 'public, max-age', and seconds we want to set will be determined by another parameter `cacheSetting.cacheTime`.
 * - If `cachePolicy` is not a accept value, value of Cache-Control would be set as 'public, max-age=300'.
 * - If `cachePolicy` is 'max-age' but `cacheSetting.cacheTime` is not a number, value of Cache-Control would be set as 'public, max-age=300' too.
 * @property {number} [cacheTime] - Seconds we want the cache to be set.
 */

/**
 * Function for setting Cache-Control on pages.
 * This function only works on `getServerSideProps` of each pages.
 *
 * @param {Res} res - response of Nextjs `getServerSideProps`
 * @param {CacheSetting} cacheSetting - Setting of Cache Control
 * @param {PageUrl} pageUrl - The page url where the cache is set. This params is just for logging warning message if needed.
 */
const setPageCache = (
  res,
  cacheSetting = { cachePolicy: 'no-store' },
  pageUrl = undefined
) => {
  switch (cacheSetting.cachePolicy) {
    case 'no-store':
    case 'no-cache':
      res.setHeader('Cache-Control', cacheSetting.cachePolicy)
      break

    case 'max-age':
      if (
        typeof cacheSetting?.cacheTime === 'number' &&
        cacheSetting?.cacheTime >= 0
      ) {
        res.setHeader(
          'Cache-Control',
          `public, ${cacheSetting.cachePolicy}=${cacheSetting?.cacheTime}`
        )
      } else {
        console.log(
          JSON.stringify({
            severity: 'NOTICE',
            message:
              'Assign Cache Policy as `max-age` but not a valid type on cache time, set Cache-Control as `public, max-age=300`',
            debugPayload: {
              pageUrl: pageUrl,
            },
          })
        )

        res.setHeader(
          'Cache-Control',
          `public, ${cacheSetting.cachePolicy}=300`
        )
      }

      break

    default:
      console.log(
        JSON.stringify({
          severity: 'NOTICE',
          message:
            'Unacceptable cache policy on Cache-Control, set Cache-Control as `public, max-age=300`',
          debugPayload: {
            pageUrl: pageUrl,
          },
        })
      )

      res.setHeader('Cache-Control', 'public, max-age=300')
      break
  }
}

export { setPageCache }
