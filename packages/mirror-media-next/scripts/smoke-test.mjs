import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const ampHtmlValidator = require('amphtml-validator')

const DEFAULT_BASE_URL = 'http://127.0.0.1:3000'
const REQUEST_TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 15000)
const AMP_VALIDATOR_JS = process.env.AMP_VALIDATOR_JS

// Each route is checked on two independent axes:
//
// 1. Liveness / structural — the route is reachable, returns HTTP 200, is not an
//    error page, and rendered its structural shell (`__NEXT_DATA__`, AMP html,
//    canonical link). A failure here means the deployed candidate is broken
//    (500 / timeout / crash / routing regression), so it FAILS on prod and on
//    any deployed non-prod environment. Only local keeps this best-effort,
//    because local detail pages depend on external dev
//    GraphQL that may not be reachable and is not a deployment under test.
//
// 2. Content-calibrated — the sample slug's title, `amphtml` link, and AMP
//    validity. These expectations are calibrated against prod data, so they are
//    required only on prod (authoritative). Other networked environments read
//    from a different CMS, so the same slug may have a different article state
//    (`state !== 'published'`, advertised) or dirty source HTML; there a content
//    failure is reported as WARN with an explanation instead of failing the run.
const AUTHORITATIVE_HOST =
  process.env.SMOKE_AUTHORITATIVE_HOST || 'www.mirrormedia.mg'

const baseUrl = normalizeBaseUrl(process.env.BASE_URL || DEFAULT_BASE_URL)
const isAuthoritativeBaseUrl = isAuthoritativeUrl(baseUrl)
const isLocalBaseUrl = isLocalUrl(baseUrl)

const storySlug = process.env.SMOKE_STORY_SLUG || '20230614ent025'
const storyTitle = process.env.SMOKE_STORY_TITLE || '徐若瑄'
const externalSlug = process.env.SMOKE_EXTERNAL_SLUG || 'dailycolumn_12846'
const externalTitle = process.env.SMOKE_EXTERNAL_TITLE || '王丹專欄'
const sectionSlug = process.env.SMOKE_SECTION_SLUG || 'entertainment'
const sectionTitle = process.env.SMOKE_SECTION_TITLE || '娛樂'
const categorySlug = process.env.SMOKE_CATEGORY_SLUG || 'news'
const categoryTitle = process.env.SMOKE_CATEGORY_TITLE || '焦點'
const tagSlug = process.env.SMOKE_TAG_SLUG || '586244ab3c1f950d00ce25b9'
const tagTitle = process.env.SMOKE_TAG_TITLE || '徐若瑄'
// This production-only fixture had fewer than five posts on 2026-07-24. It
// intentionally exercises the low-content noindex / no-canonical boundary.
// Non-authoritative CMS environments may not contain the tag at all, so their
// required tag liveness is covered by the stable fixture above instead.
const lowContentTagSlug =
  process.env.SMOKE_LOW_CONTENT_TAG_SLUG || '6a63036b001458005927eb67'
const lowContentTagTitle = process.env.SMOKE_LOW_CONTENT_TAG_TITLE || '好里家'
const searchKeyword = process.env.SMOKE_SEARCH_KEYWORD || '台股'

const routes = [
  {
    name: 'home',
    path: '/',
    amp: false,
    // home has no slug-specific content; its markers are structural liveness.
    livenessMarkers: ['鏡週刊', /id="__NEXT_DATA__"/],
    contentMarkers: [],
  },
  {
    name: 'story',
    path: `/story/${storySlug}`,
    amp: false,
    livenessMarkers: [/id="__NEXT_DATA__"/],
    // `amphtml` link is gated by article state (story-head.js: state ===
    // 'published' && !isAdvertised), so it is content-calibrated, not structural.
    contentMarkers: [storyTitle, /<link(?=[^>]+rel="amphtml")[^>]*>/],
  },
  {
    name: 'storyAmp',
    path: `/story/amp/${storySlug}`,
    amp: true,
    livenessMarkers: [
      /<html[^>]+(?:⚡|amp)(?:\s|>)/,
      /<link(?=[^>]+rel="canonical")[^>]*>/,
    ],
    contentMarkers: [storyTitle],
  },
  {
    name: 'external',
    path: `/external/${externalSlug}`,
    amp: false,
    livenessMarkers: [/id="__NEXT_DATA__"/],
    contentMarkers: [externalTitle, /<link(?=[^>]+rel="amphtml")[^>]*>/],
  },
  {
    name: 'externalAmp',
    path: `/external/amp/${externalSlug}`,
    amp: true,
    livenessMarkers: [
      /<html[^>]+(?:⚡|amp)(?:\s|>)/,
      /<link(?=[^>]+rel="canonical")[^>]*>/,
    ],
    contentMarkers: [externalTitle],
  },
  {
    name: 'section',
    path: `/section/${sectionSlug}`,
    amp: false,
    livenessMarkers: [/id="__NEXT_DATA__"/],
    contentMarkers: [sectionTitle],
  },
  {
    name: 'category',
    path: `/category/${categorySlug}`,
    amp: false,
    livenessMarkers: [/id="__NEXT_DATA__"/],
    contentMarkers: [
      categoryTitle,
      /<script[^>]+type="application\/ld\+json"[^>]*>/,
    ],
  },
  {
    name: 'tag',
    path: `/tag/${tagSlug}`,
    amp: false,
    livenessMarkers: [/id="__NEXT_DATA__"/],
    contentMarkers: [tagTitle],
  },
  {
    name: 'tagLowContentSeo',
    path: `/tag/${lowContentTagSlug}`,
    amp: false,
    authoritativeOnly: true,
    livenessMarkers: [/id="__NEXT_DATA__"/],
    contentMarkers: [
      lowContentTagTitle,
      /<meta(?=[^>]+name="robots")(?=[^>]+content="noindex")[^>]*>/,
    ],
    contentForbiddenMarkers: [/<link(?=[^>]+rel="canonical")[^>]*>/],
  },
  {
    // This is the MISO UI route. The independently deployed/repo-owned
    // `/api/search` and its Redis topology are deliberately not covered here.
    name: 'search',
    path: `/search/${searchKeyword}`,
    amp: false,
    livenessMarkers: [/id="__NEXT_DATA__"/],
    contentMarkers: [searchKeyword],
  },
]

const errorPageMarkers = [
  '抱歉！找不到這個網址',
  '這個網頁無法正常運作',
  /<h1[^>]*>\s*(?:404|500)\s*<\/h1>/i,
]

main().catch((error) => {
  console.error(`Smoke test failed: ${error.message}`)
  process.exitCode = 1
})

async function main() {
  console.log(`Smoke test BASE_URL=${baseUrl}`)
  console.log(modeMessage())

  let failureCount = 0
  let warningCount = 0
  let ampValidator

  for (const route of routes) {
    const routeUrl = resolveRouteUrl(baseUrl, route.path)
    if (route.authoritativeOnly && !isAuthoritativeBaseUrl) {
      console.log(
        `SKIP ${route.name} ${routeUrl} (authoritative CMS fixture only)`
      )
      continue
    }
    // Liveness FAILs on prod and on any deployed non-prod env; only local is
    // best-effort for detail routes (home stays required everywhere).
    const livenessRequired = !isLocalBaseUrl || route.name === 'home'
    // Content expectations are prod-calibrated, so required only on prod.
    const contentRequired = isAuthoritativeBaseUrl

    let html
    try {
      html = await fetchHtml(routeUrl)
      assertStatusOk(routeUrl, html.response)
      assertNotErrorPage(routeUrl, html.body)
      assertMarkers(routeUrl, html.body, route.livenessMarkers)
    } catch (error) {
      if (reportFailure(route, routeUrl, error, livenessRequired, 'liveness')) {
        failureCount += 1
      } else {
        warningCount += 1
      }
      // Not alive / no usable body — skip content checks for this route.
      continue
    }

    try {
      assertMarkers(routeUrl, html.body, route.contentMarkers)
      assertForbiddenMarkers(
        routeUrl,
        html.body,
        route.contentForbiddenMarkers || []
      )
      if (route.amp) {
        ampValidator ||= await getAmpValidator()
        assertAmpValid(routeUrl, html.body, ampValidator)
      }
    } catch (error) {
      if (reportFailure(route, routeUrl, error, contentRequired, 'content')) {
        failureCount += 1
      } else {
        warningCount += 1
      }
      continue
    }

    console.log(`PASS ${route.name} ${routeUrl}`)
  }

  if (warningCount > 0) {
    console.warn(
      `Non-fatal warnings: ${warningCount}. These do not fail the run; ` +
        'prod remains the authoritative target for prod-calibrated content checks.'
    )
  }

  if (failureCount > 0) {
    throw new Error(`${failureCount} required smoke check(s) failed`)
  }

  console.log('Smoke test passed.')
}

function modeMessage() {
  if (isAuthoritativeBaseUrl) {
    return `Authoritative mode (${AUTHORITATIVE_HOST}): liveness and content both required, including AMP validation and amphtml link.`
  }
  if (isLocalBaseUrl) {
    return 'Local mode: liveness is best-effort for detail routes (home still required); prod-calibrated content checks are WARN. Gate candidates against a deployed env or prod.'
  }
  return 'Deployed non-prod mode: route liveness is required (FAILs on network error / timeout / non-200 / error page / missing structure); prod-calibrated content checks (title, amphtml link, AMP validity) are WARN because this environment reads from a different CMS.'
}

// Returns true if the failure counts as FAIL, false if downgraded to WARN.
function reportFailure(route, routeUrl, error, required, phase) {
  const label = required ? 'FAIL' : 'WARN'
  console.error(`${label} ${route.name} ${routeUrl} (${phase})`)
  console.error(`  ${error.message}`)
  if (!required) {
    console.error(`  Note: ${warnNote(phase)}`)
  }
  return required
}

function warnNote(phase) {
  if (phase === 'content') {
    return (
      'non-authoritative environment. Likely a CMS content/state difference ' +
      "(e.g. article state !== 'published', advertised, or unsanitized source HTML), " +
      'not an upgrade regression. Verify against prod, which is authoritative.'
    )
  }
  return (
    'local best-effort. Detail pages depend on external dev GraphQL that may be ' +
    'unreachable or lack this slug; gate liveness against a deployed env or prod.'
  )
}

function normalizeBaseUrl(input) {
  const url = new URL(input)
  url.pathname = url.pathname.replace(/\/+$/, '')
  return url.toString()
}

function isAuthoritativeUrl(input) {
  return new URL(input).hostname === AUTHORITATIVE_HOST
}

function isLocalUrl(input) {
  const hostname = new URL(input).hostname
  return hostname === 'localhost' || hostname === '127.0.0.1'
}

function resolveRouteUrl(base, routePath) {
  const url = new URL(base)
  const pathUrl = new URL(routePath, 'http://smoke.test')
  const basePathname = url.pathname.replace(/\/+$/, '')

  url.pathname = `${basePathname}${pathUrl.pathname}`.replace(/\/+/g, '/')
  url.search = pathUrl.search
  url.hash = pathUrl.hash

  return url.toString()
}

async function fetchHtml(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'mirror-media-next-smoke-test',
      },
      signal: controller.signal,
    })
    const body = await response.text()
    return { response, body }
  } finally {
    clearTimeout(timeout)
  }
}

function assertStatusOk(url, response) {
  if (response.status !== 200) {
    throw new Error(`Expected HTTP 200 for ${url}, got ${response.status}`)
  }
}

function assertNotErrorPage(url, html) {
  const found = errorPageMarkers.find((marker) =>
    marker instanceof RegExp ? marker.test(html) : html.includes(marker)
  )
  if (found) {
    throw new Error(`Detected error page marker "${found}" in ${url}`)
  }
}

function assertMarkers(url, html, markers) {
  for (const marker of markers) {
    const matched =
      marker instanceof RegExp ? marker.test(html) : html.includes(marker)

    if (!matched) {
      throw new Error(`Missing marker "${marker.toString()}" in ${url}`)
    }
  }
}

function assertForbiddenMarkers(url, html, markers) {
  for (const marker of markers) {
    const matched =
      marker instanceof RegExp ? marker.test(html) : html.includes(marker)

    if (matched) {
      throw new Error(`Unexpected marker "${marker.toString()}" in ${url}`)
    }
  }
}

async function getAmpValidator() {
  return AMP_VALIDATOR_JS
    ? ampHtmlValidator.getInstance(AMP_VALIDATOR_JS)
    : ampHtmlValidator.getInstance()
}

function assertAmpValid(url, html, validator) {
  const result = validator.validateString(html)

  if (result.status === 'PASS') {
    return
  }

  const errorLines = result.errors
    .filter((error) => error.severity === 'ERROR')
    .slice(0, 10)
    .map(
      (error) =>
        `line ${error.line}, col ${error.col}: ${error.message} (${error.code})`
    )

  throw new Error(
    [`AMP validation failed for ${url}`, ...errorLines].join('\n  ')
  )
}
