import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const ampHtmlValidator = require('amphtml-validator')

const DEFAULT_BASE_URL = 'http://127.0.0.1:3000'
const REQUEST_TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 15000)
const AMP_VALIDATOR_JS = process.env.AMP_VALIDATOR_JS

const baseUrl = normalizeBaseUrl(process.env.BASE_URL || DEFAULT_BASE_URL)
const isLocalBaseUrl = isLocalUrl(baseUrl)

const storySlug = process.env.SMOKE_STORY_SLUG || '20230914ind003'
const storyTitle = process.env.SMOKE_STORY_TITLE || '永豐銀行加碼採購綠電'
const externalSlug = process.env.SMOKE_EXTERNAL_SLUG || 'setn_1454423'
const externalTitle = process.env.SMOKE_EXTERNAL_TITLE || '男嬰送托月餘頭骨碎裂'

const routes = [
  {
    name: 'home',
    path: '/',
    amp: false,
    requiredInLocal: true,
    markers: ['鏡週刊', /id="__NEXT_DATA__"/],
  },
  {
    name: 'story',
    path: `/story/${storySlug}`,
    amp: false,
    requiredInLocal: false,
    markers: [
      storyTitle,
      /id="__NEXT_DATA__"/,
      /<link(?=[^>]+rel="amphtml")[^>]*>/,
    ],
  },
  {
    name: 'storyAmp',
    path: `/story/amp/${storySlug}`,
    amp: true,
    requiredInLocal: false,
    markers: [
      storyTitle,
      /<html[^>]+(?:⚡|amp)(?:\s|>)/,
      /<link(?=[^>]+rel="canonical")[^>]*>/,
    ],
  },
  {
    name: 'external',
    path: `/external/${externalSlug}`,
    amp: false,
    requiredInLocal: false,
    markers: [
      externalTitle,
      /id="__NEXT_DATA__"/,
      /<link(?=[^>]+rel="amphtml")[^>]*>/,
    ],
  },
  {
    name: 'externalAmp',
    path: `/external/amp/${externalSlug}`,
    amp: true,
    requiredInLocal: false,
    markers: [
      externalTitle,
      /<html[^>]+(?:⚡|amp)(?:\s|>)/,
      /<link(?=[^>]+rel="canonical")[^>]*>/,
    ],
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
  console.log(
    isLocalBaseUrl
      ? 'Local mode: detail routes are best-effort.'
      : 'Non-local mode: all routes are required.'
  )

  let requiredFailureCount = 0
  let optionalFailureCount = 0
  let ampValidator

  for (const route of routes) {
    const required = !isLocalBaseUrl || route.requiredInLocal
    const routeUrl = resolveRouteUrl(baseUrl, route.path)

    try {
      const html = await fetchHtml(routeUrl)
      assertStatusOk(routeUrl, html.response)
      assertNotErrorPage(routeUrl, html.body)
      assertMarkers(routeUrl, html.body, route.markers)

      if (route.amp) {
        ampValidator ||= await getAmpValidator()
        assertAmpValid(routeUrl, html.body, ampValidator)
      }

      console.log(`PASS ${route.name} ${routeUrl}`)
    } catch (error) {
      const label = required ? 'FAIL' : 'WARN'
      console.error(`${label} ${route.name} ${routeUrl}`)
      console.error(`  ${error.message}`)

      if (required) {
        requiredFailureCount += 1
      } else {
        optionalFailureCount += 1
      }
    }
  }

  if (optionalFailureCount > 0) {
    console.warn(
      `Optional local route failures: ${optionalFailureCount}. Staging remains authoritative for detail routes.`
    )
  }

  if (requiredFailureCount > 0) {
    throw new Error(`${requiredFailureCount} required smoke route(s) failed`)
  }

  console.log('Smoke test passed.')
}

function normalizeBaseUrl(input) {
  const url = new URL(input)
  url.pathname = url.pathname.replace(/\/+$/, '')
  return url.toString()
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
      throw new Error(`Missing content marker "${marker.toString()}" in ${url}`)
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
