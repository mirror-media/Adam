import { IS_PREVIEW_MODE, WEEKLY_API_SERVER_ORIGIN } from '../config/index.mjs'

/**
 * Id of the JSON <script> element that `pages/_document.js` renders with
 * browser settings read from the server environment at request time. Build-time
 * values (NEXT_PUBLIC_*) cannot change per deployment, so settings that differ
 * between deployments of the same image are passed this way.
 */
export const BROWSER_RUNTIME_CONFIG_ELEMENT_ID = 'browser-runtime-config'

type BrowserRuntimeConfig = {
  weeklyApiServerRelative?: boolean
}

/**
 * Server only. Returns the JSON for the browser runtime config element, or null
 * when every setting is at its default, in which case no element is rendered.
 */
export function getBrowserRuntimeConfigJson(): string | null {
  const config: BrowserRuntimeConfig = {}

  // When 'true', browser requests to the weekly API server use a relative path
  // on the current host. Only valid where the site host routes /access-token,
  // /content/graphql and /member/graphql to the weekly API server.
  if (process.env.WEEKLY_API_SERVER_BROWSER_RELATIVE === 'true') {
    config.weeklyApiServerRelative = true
  }

  if (Object.keys(config).length === 0) {
    return null
  }
  // Escape '<' so the JSON cannot close the surrounding <script> element.
  return JSON.stringify(config).replace(/</g, '\\u003c')
}

let browserRuntimeConfig: BrowserRuntimeConfig | undefined

function readBrowserRuntimeConfig(): BrowserRuntimeConfig {
  if (browserRuntimeConfig) {
    return browserRuntimeConfig
  }

  let config: BrowserRuntimeConfig = {}
  try {
    const text = document.getElementById(
      BROWSER_RUNTIME_CONFIG_ELEMENT_ID
    )?.textContent
    if (text) {
      config = JSON.parse(text) as BrowserRuntimeConfig
    }
  } catch {
    config = {}
  }
  browserRuntimeConfig = config
  return config
}

/**
 * Base URL, without a trailing slash, for requests to the weekly API server.
 *
 * - Server: always `https://${WEEKLY_API_SERVER_ORIGIN}`.
 * - Browser: an empty string (relative path on the current host) when the
 *   runtime config enables it outside preview mode; otherwise the same
 *   absolute origin as the server default for this environment.
 */
export function getWeeklyApiServerBaseUrl(): string {
  if (
    typeof window !== 'undefined' &&
    !IS_PREVIEW_MODE &&
    readBrowserRuntimeConfig().weeklyApiServerRelative === true
  ) {
    return ''
  }
  return `https://${WEEKLY_API_SERVER_ORIGIN}`
}
