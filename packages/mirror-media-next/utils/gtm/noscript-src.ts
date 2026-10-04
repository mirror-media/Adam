export function getGtmNoscriptSrc(
  gtmId: string,
  auth?: string,
  preview?: string
) {
  const params = [
    `id=${gtmId}`,
    auth && `gtm_auth=${auth}`,
    preview && `gtm_preview=${preview}`,
    preview && `gtm_cookies_win=x`,
  ]
    .filter(Boolean)
    .join('&')

  return `https://www.googletagmanager.com/ns.html?${params}`
}
