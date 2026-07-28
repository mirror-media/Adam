const getLoginUrl = (resolvedUrl: string): string => {
  return `/login?destination=${encodeURIComponent(resolvedUrl)}`
}

export { getLoginUrl }
