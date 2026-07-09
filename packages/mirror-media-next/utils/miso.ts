import { MISO_API_KEY } from '../config/index.mjs'

const buildMisoUrl = (endpoint: string): URL => {
  const url = new URL(endpoint)
  url.searchParams.set('api_key', MISO_API_KEY)
  return url
}

const formatStoryId = (storySlug: string, storyType: string): string => {
  return storySlug.startsWith('mirrormedia')
    ? storySlug.replace(/[+\-&|!(){}[\]^"~*?:\\/]/g, '\\$&')
    : `mirrormedia_${storyType}_${storySlug}`.replace(
        /[+\-&|!(){}[\]^"~*?:\\/]/g,
        '\\$&'
      )
}

const misoFetch = async (
  url: URL,
  body: Record<string, unknown>
): Promise<Response> => {
  return fetch(url.toString(), {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
    cache: 'no-cache',
  })
}

export { buildMisoUrl, formatStoryId, misoFetch }
